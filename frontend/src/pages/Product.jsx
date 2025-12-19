import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {fetchProducts} from "../api/api";
import Header from "../components/Header.jsx";

export default function Product({cart, setCart, addToCart, username, token,  search, setSearch, logoutUser}) {
    const {id} = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetchProducts().then((products) => {
            const found = products.find((p) => p.id === Number(id));
            setProduct(found);
        });
    }, [id]);

    if (!product) {
        return (
            <>
                <p className="container">Loading...</p>
            </>
        );
    }

    return (
        <>
            <Header cart={cart} search={search} setSearch={setSearch} username={username} token={token} logoutUser={logoutUser} isSearchable={false} />

            <div className="container">
                <h2>{product.title}</h2>

                <img src={product.image} alt={product.title} style={{maxWidth: "300px", display: "block"}} />

                <p>
                    <strong>Price:</strong> ${product.price}
                </p>
                <p>{product.description}</p>
                <p>
                    <strong>Category:</strong> {product.category}
                </p>

                {product.rating && (
                    <p>
                        <strong>Rating:</strong> {product.rating.rate} ({product.rating.count} reviews)
                    </p>
                )}

                <button onClick={() => addToCart(product)}>Add to cart</button>
            </div>
        </>
    );
}