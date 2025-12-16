import {useEffect, useState} from "react";
import {fetchProducts} from "./api";

function App() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    return (
        <div style={{padding: 20}}>
            <h2>Products</h2>

            {products.map((p) => (
                <div key={p.id} style={{border: "1px solid #ccc", margin: 10, padding: 10}}>
                    <h4>{p.title}</h4>
                    <p>{p.description}</p>
                    <b>${p.price}</b>
                </div>
            ))}
        </div>
    );
}

export default App;