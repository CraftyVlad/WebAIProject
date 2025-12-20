import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FiSearch, FiShoppingCart, FiShoppingBag} from "react-icons/fi";

export default function Header({cart, search, setSearch, username, logoutUser, token, isSearchable}) {
    const totalInCart = (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <header className="header">
            <div className="header-inner">
                <div className="header-left">
                    <Link to="/" style={{color: "#ffc90e", fontWeight: "bold", alignItems: "center", display: "inline-flex", gap: "10px"}}>
                        <FiShoppingBag size={30} />
                        Store With AI ©
                    </Link>
                </div>
                <div className="header-center">
                    {isSearchable && (
                        <div className="search-wrapper">
                            <FiSearch size={20} className="search-icon" />
                            <input
                                className="search-input"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <div className="header-right">
                    <nav style={{alignItems: "center", display: "flex", gap: "15px"}}>
                        <Link to="/cart" style={{color: "#ffc90e", fontWeight: "bold", alignItems: "center", display: "inline-flex", gap: "5px"}}>
                            <FiShoppingCart size={20} /> ({totalInCart})
                        </Link>
                        {token ? (
                            <>
                                {username && (
                                    <span style={{color: "#ffc90e", alignItems: "center"}} className="user">
                                        Hello, {username}!
                                    </span>
                                )}
                                <button className="button" onClick={logoutUser}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="button">
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
