import {Routes, Route, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import {useEffect, useState} from "react";
import {login, register} from "./api/api";

export default function App() {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem("cart");
            return saved ? JSON.parse(saved) : [];
        } catch {
            localStorage.removeItem("cart");
            return [];
        }
    });
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [username, setUsername] = useState(localStorage.getItem("username"));
    // const [inputUsername, setInputUsername] = useState("");
    // const [inputEmail, setInputEmail] = useState("");
    // const [inputPassword, setInputPassword] = useState("");
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function updateCart(newCart) {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    }

    // function validateLogin() {
    //     if (!inputUsername.trim()) return "Username is required";
    //     if (!inputEmail.includes("@")) return "Email is invalid";
    //     if (inputPassword.length < 6) return "Password too short";
    //     return null;
    // }

    async function handleLogin(username, email, password, onSuccess) {
        const data = await login(username, email, password);
        setToken(data.jwt);
        setUsername(username);
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("username", username);
        onSuccess();
        navigate("/");
    }

    async function handleRegister(username, email, password, onSuccess) {
        await register(username, email, password);
        onSuccess();
        navigate("/login");
    }

    function logoutUser() {
        setToken(null);
        setUsername(null);
        localStorage.clear();
        setCart([]);
    }

    function addToCart(product) {
        let newCart;
        const existing = cart.find((p) => p.id === product.id);

        if (existing) {
            newCart = cart.map((p) => (p.id === product.id ? {...p, quantity: p.quantity + 1} : p));
        } else {
            newCart = [...cart, {...product, quantity: 1}];
        }

        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    }

    return (
        <Routes>
            <Route
                path="/"
                element={<Home cart={cart} username={username} search={search} setSearch={setSearch} token={token} logoutUser={logoutUser} />}
            />
            <Route path="/login" element={<Login token={token} handleLogin={handleLogin} />} />
            <Route path="/register" element={<Register token={token} handleRegister={handleRegister} />} />
            <Route
                path="/product/:id"
                element={
                    <Product
                        cart={cart}
                        setCart={setCart}
                        addToCart={addToCart}
                        username={username}
                        token={token}
                        search={search}
                        setSearch={setSearch}
                        logoutUser={logoutUser}
                    />
                }
            />
            <Route
                path="/cart"
                element={<Cart cart={cart} setCart={setCart} username={username} token={token} updateCart={updateCart} logoutUser={logoutUser} />}
            />
        </Routes>
    );
}
