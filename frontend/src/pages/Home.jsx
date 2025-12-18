import {useEffect, useState} from "react";
import {fetchProducts, chat} from "../api/api";
import {Link} from "react-router-dom";
import "../App.css";
import "../components/ProductGrid.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Chat from "../components/Chat.jsx";

export default function App() {
    const [username, setUsername] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");
    const [chatReply, setChatReply] = useState("");
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    async function sendChat() {
        const res = await chat(message, token);
        setChatReply(res.answer);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
    }

    return (
        <div className="container">
            {!token && (
                <>
                    <Link to="/login">Login</Link>
                    <br />
                    <Link to="/register">Register</Link>
                    <br />
                    <br />
                </>
            )}

            {token && (
                <>
                    <p>{username}</p>
                    <button onClick={logout}>Logout</button>
                    <br />
                    <br />
                </>
            )}

            <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />

            <Chat token={token} />

            <h3>Products</h3>
            <ProductGrid products={products} search={search} />
        </div>
    );
}
