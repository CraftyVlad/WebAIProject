from fastapi import APIRouter, HTTPException
import json

router = APIRouter()

with open("products.json", "r", encoding="utf-8") as f:
    PRODUCTS = json.load(f)

@router.get("/")
def get_products():
    return PRODUCTS