import { Link } from "react-router-dom";

export default function ProductGrid({products, search}) {
    return (
        <div className="products-grid">
            {products
                .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
                .map((p) => (
                    <Link key={p.id} to={`/product/${p.id}`} className="product-card-link">
                        <div className="product-card">
                            <img src={p.image} alt="product" />
                            <div>
                                <h4>{p.title}</h4>
                                <p>
                                    {p.rating.rate}/5 (Out of {p.rating.count})
                                </p>
                                <br />${p.price}
                            </div>
                        </div>
                    </Link>
                ))}
        </div>
    );
}