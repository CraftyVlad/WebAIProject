from fastapi import APIRouter, HTTPException
import requests

router = APIRouter()

FAKESTORE_URL = "https://fakestoreapi.com/products"

@router.get("/", include_in_schema=True)
@router.get("", include_in_schema=False)
def get_products():
    try:
        res = requests.get(
        FAKESTORE_URL,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json",
        },
        timeout=10,
    )
        res.raise_for_status()
        return res.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Upstream API error: {e}")