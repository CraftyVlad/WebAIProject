import {useState} from "react";
import {Link} from "react-router-dom";

export default function Register({token, handleRegister}) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function submit() {
        if (username.trim() === "") return setError("Username is required");
        if (!email.includes("@")) return setError("Email is invalid");
        if (password.length < 6) return setError("Password too short");
        try {
            setError("");
            await handleRegister(username, email, password, () => {
                setUsername("");
                setEmail("");
                setPassword("");
            });
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div style={{padding: 20}}>
            <header className="header">
                <div className="header-inner">
                    <Link to="/">Store With AI ©</Link>
                    <h2>Register</h2>
                </div>
            </header>

            {!token && (
                <>
                    <input value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} required />
                    <br />
                    <input value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} required />
                    <br />
                    <input
                        placeholder="password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <br />
                    <button onClick={submit}>Register</button>
                    <br />
                    {error && <p style={{color: "red"}}>{error}</p>}
                    <Link to="/login">Already have an account? Login here.</Link>
                </>
            )}
        </div>
    );
}
