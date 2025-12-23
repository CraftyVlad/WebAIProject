from fastapi import APIRouter, Depends, HTTPException
from models.chat import ChatRequest
from utils.user import get_current_user
import requests
from groq import Groq
import os, json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

with open("products.json", "r", encoding="utf-8") as f:
    PRODUCTS = json.load(f)

@router.post("/")
def chat(body: ChatRequest, current_user: dict = Depends(get_current_user)):
    if not body.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    products = PRODUCTS

    prompt = f"""
You are a store assistant. Reply in the same language as the user’s question.
IF you mention products, provide a link at the end of the chat (without brackets) to the product page like: 

"Check out {{name}} here: {FRONTEND_URL}/product/{{id}}"

or something similar, however change it to the users language.
Don't make up links for products that don't exist.
Don't mention links if you aren't referring to a product or if the user hasn't said anything about products.
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
        "user": current_user["email"],
        "answer": response.choices[0].message.content
    }