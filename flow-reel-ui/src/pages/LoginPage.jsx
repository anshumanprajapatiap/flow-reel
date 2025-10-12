import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUser, addUser } from "../api/userService";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim() || (!isLogin && !name.trim())) return;

    const userData = { id: userId, name, password };

    try {
      const data = isLogin ? await getUser(userData) : await addUser(userData);

      localStorage.setItem("flowreel_user", JSON.stringify(data.user || userData));
      navigate("/dashboard");
    }catch( error ){
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-[380px] border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
          🎬 FlowReel {isLogin ? "Login" : "Signup"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-400"
          />

          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-400"
            />
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-400"
          />

          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
