import {useState} from "react";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Register({cart, token, handleRegister}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function submit() {
        if (!email.includes("@")) return setError("Email is invalid");
        if (password.length < 6) return setError("Password too short");
        try {
            setError("");
            await handleRegister(email, password, () => {
                setEmail("");
                setPassword("");
            });
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div>
            <Header cart={cart} token={null} email={null} isSearchable={false} />

            <div className="container">
                <Link to="/" style={{fontWeight: "bold", display: "block", paddingTop: 20}}>
                    ← Back
                </Link>
                <div className="container-inner">
                    <h2 style={{padding: "22px 0", margin: "0"}}>Register</h2>
                    {!token && (
                        <>
                            <input className="input" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} required />
                            <br />
                            <input
                                className="input"
                                placeholder="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <br />
                            <button className="button" onClick={submit}>
                                Register
                            </button>
                            <br />
                            {error && (
                                <>
                                    <span style={{color: "red"}}>{error}</span>
                                    <br />
                                </>
                            )}

                            <Link to="/login" style={{textDecoration: "underline"}}>
                                Already have an account? Login here.
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
