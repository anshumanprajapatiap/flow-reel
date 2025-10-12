import { useState } from "react";
import { User, LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className="relative inline-block text-left">
      {/* Profile Avatar / Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2  bg-gray-800 text-white rounded-full hover:bg-gray-700"
      >
        <User size={18} />
        <span className="text-sm font-medium">Profile</span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="flex flex-col py-2">
            {/* Profile */}
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
            >
              <User size={16} /> View Profile
            </button>

            {/* Theme Toggle */}
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleTheme}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {/* Logout */}
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
              onClick={() => {
                navigate("/");
                setOpen(false);
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
