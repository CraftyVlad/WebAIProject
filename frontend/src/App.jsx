import {useEffect, useState} from "react";
import {register, login, fetchProducts, chat} from "./api";

export default function App() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");
    const [chatReply, setChatReply] = useState("");

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    async function handleLogin() {
        const data = await login(username, email, password);
        if (data.jwt) {
            localStorage.setItem("token", data.jwt);
            setToken(data.jwt);
        }
        if (login) {
            alert("Logged in!");
        }
    }

    async function handleRegister() {
        await register(username, email, password);
        if (register) {
            alert("Registered! Now login.");
        }
    }

    async function sendChat() {
        const res = await chat(message, token);
        setChatReply(res.answer);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
    }

    return (
        <div style={{padding: 20}}>
            <h2>Store With AI</h2>

            {!token && (
                <>
                    <h3>Auth</h3>
                    <input placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                    <br />
                    <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <button onClick={handleRegister}>Register</button>
                    <button onClick={handleLogin}>Login</button>
                </>
            )}

            {token && (
                <>
                    <p>{username}</p>
                    <button onClick={logout}>Logout</button>

                    <h3>Chat with AI</h3>
                    <input placeholder="Ask about products..." onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={sendChat}>Send</button>

                    {chatReply && <pre style={{whiteSpace: "pre-wrap"}}>{chatReply}</pre>}
                </>
            )}

            <h3>Products</h3>
            {products.map((p) => (
                <div key={p.id} style={{border: "1px solid #ccc", margin: 8, padding: 8}}>
                    <b>{p.title}</b>
                    <br />${p.price}
                </div>
            ))}
        </div>
    );
}