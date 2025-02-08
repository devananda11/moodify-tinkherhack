import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CLIENT_ID = "2db343c0ce3b41c7be4f3363cfdd005a";
const REDIRECT_URI =
  window.location.hostname === "localhost"
    ? "http://localhost:5173/callback"
    : "https://moodify-devananda11s-projects.vercel.app/callback";

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-modify-public",
  "playlist-modify-private",
].join(" ");

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get("access_token");
    if (token) {
      localStorage.setItem("spotify_access_token", token);
      window.history.replaceState(null, null, window.location.pathname);
      navigate("/playlists");
    }
  }, [navigate]);

  const handleLogin = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem("spotify_auth_state", state);
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(
      SCOPES
    )}&state=${state}&show_dialog=true`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1DB954]">
      <Button
        onClick={handleLogin}
        className="bg-spotify-green hover:bg-spotify-green-dark text-black font-bold py-3 px-4 rounded-full flex items-center justify-center"
      >
        Login with Spotify
      </Button>
    </div>
  );
}
