import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Header from "../components/Header.jsx";

export function getCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export default function Cart({cart, setCart, username, token, updateCart,  logoutUser}) {

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function removeItem(id) {
        updateCart(cart.filter((p) => p.id !== id));
    }

    function changeQuantity(id, amount) {
        updateCart(cart.map((p) => (p.id === id ? {...p, quantity: Math.max(1, p.quantity + amount)} : p)));
    }

    const total = Array.isArray(cart) ? cart.reduce((sum, p) => sum + p.price * p.quantity, 0) : 0;

    return (
        <div className="container">
            <Header cart={cart} token={token} username={username} logoutUser={logoutUser} isSearchable={false} />
            <h2>Your Cart</h2>
            {cart.length === 0 && <p>Cart is empty</p>}
            {cart.map((item) => (
                <div key={item.id}>
                    <strong>{item.title}</strong>
                    <p>${item.price}</p>

                    <button onClick={() => changeQuantity(item.id, -1)}>-</button>
                    {item.quantity}
                    <button onClick={() => changeQuantity(item.id, 1)}>+</button>

                    <button onClick={() => removeItem(item.id)}>Remove</button>
                </div>
            ))}
            <h3>Total: ${total.toFixed(2)}</h3>
            <button disabled={cart.length === 0} onClick={() => alert("Checkout not made yet.")}>
                Proceed to Checkout
            </button>
        </div>
    );
}
