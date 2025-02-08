import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
      navigate("/playlists"); // Redirect to playlists page
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
}
