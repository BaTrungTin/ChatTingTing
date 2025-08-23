import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 w-full z-40 bg-white/20 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-all"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center backdrop-blur-sm">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-black">Chat ting ting</h1>
        </Link>

        {/* Links & actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/settings"
            className="btn btn-sm gap-2 transition-colors bg-white/30 hover:bg-white/50 backdrop-blur-sm"
          >
            <Settings className="w-4 h-4 text-black" />
            <span className="hidden sm:inline text-black">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link
                to="/profile"
                className="btn btn-sm gap-2 bg-white/30 hover:bg-white/50 backdrop-blur-sm"
              >
                <User className="w-5 h-5 text-black" />
                <span className="hidden sm:inline text-black">Profile</span>
              </Link>

              <button
                className="btn btn-sm gap-2 bg-white/30 hover:bg-white/50 backdrop-blur-sm"
                onClick={logout}
              >
                <LogOut className="w-5 h-5 text-black" />
                <span className="hidden sm:inline text-black">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
