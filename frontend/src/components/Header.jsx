import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header({cart, search, setSearch, username, logoutUser, token, isSearchable}) {

    const totalInCart = (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <header className="header">
            <div className="header-inner">
                <Link to="/">Store With AI ©</Link>
                {isSearchable && <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />}
                <nav>
                    {!token && (
                        <>
                            <Link to="/login">Login</Link>
                        </>
                    )}

                    {token && (
                        <>
                            {username && <span className="user">Hello, {username}!</span>}
                            <button onClick={logoutUser}>Logout</button>
                        </>
                    )}
                    <Link to="/cart">Go to Cart ({totalInCart})</Link>
                </nav>
            </div>
        </header>
    );
}
