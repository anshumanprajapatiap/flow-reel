import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // if (!username.trim()) return;

    // Simulate login
    const user = { id: username.toLowerCase().replace(/\s+/g, "_"), name: username };
    localStorage.setItem("flowreel_user", JSON.stringify(user));

    // Save user in backend
    await fetch("http://localhost:8000/api/user/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-[380px] border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
          🎬 FlowReel Login
        </h1>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-400"
          />

          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
