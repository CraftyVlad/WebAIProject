const API_URL = "http://localhost:8000/api";

export async function register(username, email, password) {
    const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });
    return res.json();
}

export async function login(username, email, password) {
    const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });
    return res.json();
}

export async function fetchProducts() {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
}

export async function chat(question, token) {
    const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ question }),
    });
    return res.json();
}