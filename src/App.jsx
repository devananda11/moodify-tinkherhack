import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./app/page"; // Ensure this file exists
import Playlist from "./app/Playlist";
import SpotifyCallback from "./app/SpotifyCallback";
import Landing from "./app/Landing"; // Create this file
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playlists" element={<Playlist />} />
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route path="/landing" element={<Landing/>}/>
      </Routes>
    </Router>
  );
}
