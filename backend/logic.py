import random

def get_custom_response(user_input: str) -> str:
    user_input = user_input.lower().strip()
    
    intents = {
        "greetings": ["hello", "hi", "hey", "greetings"],
        "status": ["how are you", "how's it going", "how are things"],
        "identity": ["who are you", "what are you", "your name"],
        "capabilities": ["what can you do", "help", "commands"]
    }

    responses = {
        "greetings": ["Hello! How can I assist you today?", "Hi there! I'm your local assistant.", "Hey! Ready to chat?"],
        "status": ["I'm running smoothly on your local machine!", "Doing great, thanks for asking!", "All systems go."],
        "identity": ["I am a custom-built local chatbot created with FastAPI and React.", "I'm your private, local AI companion."],
        "capabilities": ["I can store our chats, remember who you are, and respond to basic queries without any external APIs!"]
    }

    # Check for keywords
    for intent, keywords in intents.items():
        if any(keyword in user_input for keyword in keywords):
            return random.choice(responses[intent])
            
    # Default response 
    return "That's an interesting point. Could you tell me more about that? (I'm a local bot, so I'm still learning!)"