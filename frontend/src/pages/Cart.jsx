import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export function getCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export default function Cart({cart, email, token, updateCart, logoutUser}) {
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
        <>
            <Header cart={cart} token={token} email={email} logoutUser={logoutUser} isSearchable={false} />
            <div className="container">
                <h2 style={{padding: "22px 0", margin: "0"}}>Your Cart</h2>
                {cart.length === 0 && <p>Cart is empty</p>}
                {cart.map((item) => (
                    <div key={item.id} className="product-cart">

                        <Link to={`/product/${item.id}`} style={{display: "inline-flex", alignItems: "center", gap: 20}}>
                            <img src={item.image} alt={item.title} style={{width: 100, height: 100, objectFit: "contain"}} />
                            <h4>{item.title}</h4>
                        </Link>

                        <div style={{display: "inline-flex", alignItems: "center", gap: 20}}>
                            <p>${item.price}</p>

                            <button className="button" onClick={() => changeQuantity(item.id, -1)}>
                                -
                            </button>
                            {item.quantity}
                            <button className="button" onClick={() => changeQuantity(item.id, 1)}>
                                +
                            </button>

                            <button className="button" onClick={() => removeItem(item.id)}>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
                <h3>Total: ${total.toFixed(2)}</h3>
                {token ? (
                    <button className="button" disabled={cart.length === 0} onClick={() => alert("Checkout not made yet.")}>
                        Proceed to Checkout
                    </button>
                ) : (
                    <p>Please login to proceed to checkout.</p>
                )}
            </div>
            <Footer />
        </>
    );
}
