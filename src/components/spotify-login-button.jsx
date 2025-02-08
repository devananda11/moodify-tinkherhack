"use client"

import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";

const CLIENT_ID = "2db343c0ce3b41c7be4f3363cfdd005a";
const REDIRECT_URI = "http://localhost:5173/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

export default function SpotifyLoginButton() {
    const navigate = useNavigate();
  
    const handleLogin = () => {
      const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&response_type=${RESPONSE_TYPE}&scope=user-read-private user-read-email playlist-modify-public playlist-modify-private`;
      
      // Store URL in localStorage
      localStorage.setItem("spotify_auth_url", authUrl);
      
      // Redirect to Spotify login
      window.location.href = authUrl;
    };
  

  return (
    <Button
      onClick={handleLogin}
      className="w-full bg-spotify-green hover:bg-spotify-green-dark text-black font-bold py-3 px-4 rounded-full flex items-center justify-center"
    >
      <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
      Login with Spotify
    </Button>
  )
}

