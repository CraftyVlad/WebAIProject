from fastapi import HTTPException
import requests

def get_products():
    try:
        res = requests.get(
            "https://fakestoreapi.com/products",
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