import {useState, useRef, useEffect} from "react";
import {chat} from "../api/api";
import {HiOutlineSparkles} from "react-icons/hi2";

export default function Chat({token}) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages([]);
    }, [token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    async function sendChat() {
        if (!message.trim()) return;

        setMessages([...messages, {sender: "user", text: message}]);
        setMessage("");

        if (!token) return;

        try {
            const res = await chat(message, token);
            setMessages((prev) => [...prev, {sender: "assistant", text: res.answer}]);
        } catch (err) {
            setMessages((prev) => [...prev, {sender: "assistant", text: "Error: " + err.message}]);
        }
    }

    return (
        <>
            <button className="chat-button" onClick={() => setOpen(!open)}>
                <HiOutlineSparkles size={24} />
            </button>

            <div className={`chat-panel ${open ? "open" : ""}`}>
                <div className="chat-header">
                    <h3>Chat with Store Assistant</h3>
                    <button className="button" onClick={() => setOpen(false)}>✕</button>
                </div>

                <div className="chat-body">
                    {!token && <p>Please login to use the chat feature.</p>}
                    {token && (
                        <>
                            <div className="chat-messages">
                                {messages.map((m, i) => (
                                    <div key={i} className={`chat-message ${m.sender}`}>
                                        <b>{m.sender === "user" ? "You:" : "Store assistant:"}</b> {m.text}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="chat-input">
                                <input
                                    placeholder="Ask about products..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                                />
                                <button className="button" onClick={sendChat}>Send</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
