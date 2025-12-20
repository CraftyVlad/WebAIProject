const API_URL = "http://localhost:8000/api";

async function handleResponse(res) {
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail || "Request failed");
    }

    return data;
}

export async function register(email, password) {
    const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
    });
    return handleResponse(res);
}

export async function login(email, password) {
    const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
    });
    return handleResponse(res);
}

export async function fetchProducts() {
    const res = await fetch(`${API_URL}/products`);
    return handleResponse(res);
}

export async function chat(question, token) {
    const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({question}),
    });
    return handleResponse(res);
}
