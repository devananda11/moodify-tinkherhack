import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle the authentication
    const handleAuthentication = () => {
      const hash = window.location.hash;
      
      // Only proceed if there's a hash
      if (hash && hash.length > 0) {
        console.log("Full URL Hash:", hash);

        // Remove the # from the hash
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const error = params.get("error");

        if (error) {
          console.error("Authentication error:", error);
          navigate("/");
          return;
        }

        if (accessToken) {
          console.log("Saving Token:", accessToken);

          // Save the token
          sessionStorage.setItem("spotify_access_token", accessToken);
          localStorage.setItem("spotify_access_token", accessToken);

          // Clear the hash
          window.history.replaceState(null, null, window.location.pathname);

          // Navigate to playlists
          navigate("/");
          return;
        }
      }

      // Check if we already have a token
      const existingToken = localStorage.getItem("spotify_access_token");
      if (existingToken) {
        navigate("/");
        return;
      }

      // If we get here, no token was found
      console.error("Spotify login failed or token missing.");
      navigate("/");
    };

    handleAuthentication();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1DB954]">
      <div className="text-white text-xl font-semibold">
        Authenticating with Spotify...
      </div>
    </div>
  );
}