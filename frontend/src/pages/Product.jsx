import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import { fetchProducts } from "../api/api";

export default function Product() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetchProducts().then(products => {
            const found = products.find(p => p.id === parseInt(id))
            setProduct(found)
        })
    }, [id])

    if (!product) return <p>Loading...</p>

    return (
        <div className="container">
            <Link to="/">Home</Link>
            <h2>{product.title}</h2>
            <img src={product.image} alt={product.title} style={{maxWidth: "300px"}} />
            <p>Price: ${product.price}</p>
            <p>{product.description}</p>
            <p>Category: {product.category}</p>
            <p>
                Rating: {product.rating.rate} ({product.rating.count} reviews)
            </p>
        </div>
    );
}