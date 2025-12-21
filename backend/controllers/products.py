from fastapi import APIRouter, HTTPException
import requests

router = APIRouter()

@router.get("/", include_in_schema=True)
@router.get("", include_in_schema=False)
def get_products():
    try:
        res = requests.get("https://fakestoreapi.com/products", timeout=10)
        res.raise_for_status()
        return res.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Upstream API error: {e}")