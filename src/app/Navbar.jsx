import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-modify-public",
  "playlist-modify-private",
].join(" ");

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("spotify_access_token") || "");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");

      if (accessToken) {
        localStorage.setItem("spotify_access_token", accessToken);
        setToken(accessToken);
        window.history.replaceState(null, null, window.location.pathname);
      }
    }

    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [token]);

  const handleLogin = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}&show_dialog=true`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    setToken("");
    localStorage.clear();
    setUser(null);
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold text-green-500">
        Moodify
      </Link>
      <div className="flex items-center gap-4">
        {token && user ? (
          <>
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
              Logout
            </Button>
            <Avatar>
              <AvatarImage src={user.images?.[0]?.url} alt={user.display_name} />
              <AvatarFallback>{user.display_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </>
        ) : (
          <Button onClick={handleLogin} className="bg-green-500 hover:bg-green-600">
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
