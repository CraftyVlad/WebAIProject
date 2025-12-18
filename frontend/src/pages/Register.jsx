import {useState} from "react";
import {register} from "../api/api";
import {Link, useNavigate} from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [error, setError] = useState("");

    async function handleRegister() {
        try {
            setError("");
            await register(username, email, password);
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    }
    return (
        <div style={{padding: 20}}>
            <Link to="/">Home</Link>
            <h2>Register</h2>

            {!token && (
                <>
                    <input placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                    <br />
                    <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <input
                        placeholder="password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (e.target.value.length < 6) {
                                setError("Password too short");
                            } else {
                                setError("");
                            }
                        }}
                    />
                    <br />
                    <button onClick={handleRegister}>Register</button>
                    <br />
                    {error && <p style={{color: "red"}}>{error}</p>}
                </>
            )}
        </div>
    );
}
