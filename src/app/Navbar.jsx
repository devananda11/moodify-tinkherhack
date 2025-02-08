import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      setAccessToken(token);
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error("Error fetching user data:", err));
    } else {
      setUser(null);
      setAccessToken(null);
      if (location.pathname !== "/") {
        navigate("/"); // Redirect to home if not logged in
      }
    }
  }, [accessToken, navigate, location.pathname]);

  const handleLogout = () => {
    console.log("Logging out...");
  
    // ❌ Remove token from both storages
    localStorage.removeItem("spotify_access_token");
    sessionStorage.removeItem("spotify_access_token");
  
    // ✅ Force full page reload to clear session
    window.location.href = "/";
  };
  

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold text-green-500">
        Moodify
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Avatar>
              <AvatarImage src={user.images?.[0]?.url} alt={user.display_name} />
              <AvatarFallback>{user.display_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button onClick={handleLogout} variant="default">
              Logout
            </Button>
          </>
        ) : (
          <Button
            onClick={() => navigate("/")}
            className="bg-green-500 hover:bg-green-600"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
