from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Portfolio Chatbot API")

# CORS - allow your portfolio domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    message: str
    context: str

class ChatResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    return {"status": "healthy", "message": "Portfolio Chatbot API"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": f"{request.context}\n\nRules:\n- Keep responses concise and conversational\n- Do NOT use markdown formatting (no **, no ##, no bullet points with -)\n- Use plain text only\n- For lists, use simple numbered format like '1. item' on new lines\n- Be friendly and helpful"
                },
                {"role": "user", "content": request.message}
            ],
            max_tokens=300,
            temperature=0.7
        )
        return ChatResponse(response=response.choices[0].message.content)
    except Exception as e:
        print(f"Error: {e}")  # Log error to terminal
        raise HTTPException(status_code=500, detail=str(e))

# AWS Lambda handler
from mangum import Mangum
handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
