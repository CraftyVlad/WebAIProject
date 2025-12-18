import {useState} from "react";
import {chat} from "../api/api";

export default function Chat({token}) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    async function sendChat() {
        if (!message) return;

        setMessages([...messages, {sender: "user", text: message}]);

        const res = await chat(message, token);

        setMessages((prev) => [...prev, {sender: "store assistant", text: res.answer}]);
        setMessage("");
    }

    return (
        <>
            <button className="chat-button" onClick={() => setOpen(!open)}>
                CHAT
            </button>

            <div className={`chat-panel ${open ? "open" : ""}`}>
                <button onClick={() => setOpen(false)}>Close</button>
                <h3>Chat with AI</h3>

                {!token && <p>Please login to use the chat feature.</p>}

                {token && (
                    <>
                        <div className="chat-messages" style={{maxHeight: "300px", overflowY: "auto", marginBottom: "10px"}}>
                            {messages.map((m, i) => (
                                <div key={i} style={{marginBottom: "5px"}}>
                                    <b>{m.sender === "user" ? "You:" : "Store assistant:"}</b> {m.text}
                                </div>
                            ))}
                        </div>

                        <input
                            placeholder="Ask about products..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendChat();
                            }}
                        />
                        <button onClick={sendChat}>Send</button>
                    </>
                )}
            </div>
        </>
    );
}