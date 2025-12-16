from fastapi import APIRouter
import requests

router = APIRouter()

@router.get("/")
def get_products():
    res = requests.get("https://fakestoreapi.com/products")
    return res.json()