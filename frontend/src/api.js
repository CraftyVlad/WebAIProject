const API_URL = "http://localhost:8000/api";

export async function fetchProducts() {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
}