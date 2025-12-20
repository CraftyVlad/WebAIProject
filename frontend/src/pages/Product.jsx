import {useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {fetchProducts} from "../api/api";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function Product({cart, addToCart, email, token,  search, setSearch, logoutUser}) {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts().then((products) => {
            const found = products.find((p) => p.id === Number(id));
            setProduct(found);
        });
    }, [id]);

    if (!product) {
        return (
            <>
                <div className="container">
                    <h2>Loading...</h2>
                </div>
            </>
        );
    }

    const isInCart = cart.find((p) => p.id === product.id);

    return (
        <>
            <Header
                cart={cart}
                search={search}
                setSearch={setSearch}
                email={email}
                token={token}
                logoutUser={logoutUser}
                isSearchable={false}
            />

            <div className="container" style={{display: "flex", justifyContent: "center", flexDirection: "column", gap: 20}}>
                <Link onClick={() => navigate(-1)} style={{fontWeight: "bold"}}>
                    ← Back
                </Link>
                <div className="product-container">
                    <img src={product.image} alt={product.title} />

                    <div className="product-detail">
                        <h2>{product.title}</h2>
                        <p>{product.description}</p>

                        <p>
                            <strong>Category:</strong> {product.category}
                        </p>
                        {product.rating && (
                            <p>
                                <strong>Rating:</strong> {product.rating.rate} ({product.rating.count} reviews)
                            </p>
                        )}
                        <p></p>

                        <div style={{display: "flex", gap: 20, alignItems: "center", maxWidth: "100%", justifyContent: "center"}}>
                            <h3>${product.price}</h3>
                            {isInCart ? (
                                <Link className="button" to="/cart" style={{backgroundColor: "#ffe78fff"}}>
                                    Go to cart
                                </Link>
                            ) : (
                                <button className="button" onClick={() => addToCart(product)}>
                                    Add to cart
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}