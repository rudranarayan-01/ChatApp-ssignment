from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
import bcrypt

import models, database, logic

app = FastAPI(title="Local ChatGPT")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

class AuthSchema(BaseModel):
    username: str
    password: str = Field(..., max_length=72)

def hash_password(password: str) -> str:
    # Bcrypt requires bytes
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

# Auth Routes

@app.post("/register")
def register(data: AuthSchema, db: Session = Depends(database.get_db)):
    # Check if user exists
    existing_user = db.query(models.User).filter(models.User.username == data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Securely hash and save
    hashed_pw = hash_password(data.password)
    new_user = models.User(username=data.username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    return {"message": "Success"}

@app.post("/login")
def login(data: AuthSchema, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == data.username).first()
    
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return {"id": user.id, "username": user.username}

# Conversation route

@app.get("/conversations/{user_id}")
def get_user_conversations(user_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Conversation).filter(models.Conversation.user_id == user_id).all()

@app.post("/conversations/{user_id}")
def create_conversation(user_id: int, db: Session = Depends(database.get_db)):
    new_chat = models.Conversation(user_id=user_id)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

@app.delete("/conversations/{conv_id}")
def delete_conversation(conv_id: int, db: Session = Depends(database.get_db)):
    db_conv = db.query(models.Conversation).filter(models.Conversation.id == conv_id).first()
    if not db_conv:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(db_conv)
    db.commit()
    return {"message": "Deleted"}



@app.post("/chat/{conv_id}")
def chat(conv_id: int, user_message: str, db: Session = Depends(database.get_db)):
    user_msg = models.Message(conversation_id=conv_id, sender="user", content=user_message)
    db.add(user_msg)
    
    bot_content = logic.get_custom_response(user_message)
    
    bot_msg = models.Message(conversation_id=conv_id, sender="bot", content=bot_content)
    db.add(bot_msg)
    
    db.commit()
    return {"bot": bot_content}

@app.get("/history/{conv_id}")
def get_history(conv_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Message).filter(models.Message.conversation_id == conv_id).all()