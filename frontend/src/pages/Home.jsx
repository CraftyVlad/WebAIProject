import {useEffect, useState} from "react";
import {fetchProducts} from "../api/api";
import "../styles/App.css";
import "../components/ProductGrid.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Chat from "../components/Chat.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function Home({cart, username, search, setSearch, token, logoutUser}) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    return (
        <>
            <Header search={search} cart={cart} setSearch={setSearch} username={username} logoutUser={logoutUser} token={token} isSearchable={true} />
            <div className="container">
                <h3 style={{padding: "22px 0", margin: "0"}}>Products</h3>
                <ProductGrid products={products} search={search} />
            </div>
            <Footer />
        </>
    );
}
