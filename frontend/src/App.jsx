import {Routes, Route, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import {useEffect, useState} from "react";
import {login, register} from "./api/api";
import Chat from "./components/Chat";

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
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function updateCart(newCart) {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    }

    async function handleLogin(email, password, onSuccess) {
        const data = await login(email, password);
        setToken(data.jwt);
        setEmail(email);
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("email", email);
        onSuccess();
        navigate("/");
    }

    async function handleRegister(email, password, onSuccess) {
        await register(email, password);
        onSuccess();
        navigate("/login");
    }

    function logoutUser() {
        setToken(null);
        setEmail(null);
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
        <>
            <Routes>
                <Route
                    path="/"
                    element={<Home cart={cart} email={email} search={search} setSearch={setSearch} token={token} logoutUser={logoutUser} />}
                />
                <Route path="/login" element={<Login cart={cart} token={token} handleLogin={handleLogin} />} />
                <Route path="/register" element={<Register cart={cart} token={token} handleRegister={handleRegister} />} />
                <Route
                    path="/product/:id"
                    element={
                        <Product
                            cart={cart}
                            addToCart={addToCart}
                            email={email}
                            token={token}
                            search={search}
                            setSearch={setSearch}
                            logoutUser={logoutUser}
                        />
                    }
                />
                <Route
                    path="/cart"
                    element={<Cart cart={cart} email={email} token={token} updateCart={updateCart} logoutUser={logoutUser} />}
                />
            </Routes>

            <Chat token={token} />
        </>
    );
}
