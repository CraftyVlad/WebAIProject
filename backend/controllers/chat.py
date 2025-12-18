from fastapi import APIRouter, Depends, HTTPException
from models.chat import ChatRequest
from utils.user import get_current_user
import requests
from groq import Groq
from dotenv import load_dotenv
import os, json

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

FAKESTORE_URL = "https://fakestoreapi.com/products"

@router.post("")
def chat(body: ChatRequest, current_user: dict = Depends(get_current_user)):
    if not body.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    resp = requests.get(FAKESTORE_URL)
    if resp.status_code != 200:
        return {"error": "Failed to fetch products"}
        

    products = resp.json()

    prompt = f"""
You are a store assistant. Reply in the same language as the user’s question.
Answer ONLY using this product data:

{json.dumps(products, indent=2)}

User question:
{body.question}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    return {
        "user": current_user["username"],
        "answer": response.choices[0].message.content
    }