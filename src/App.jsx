import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./app/page"; // Ensure this file exists
import Playlist from "./app/Playlist";
import SpotifyCallback from "./app/SpotifyCallback";
import Navbar from "./app/Navbar";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playlists" element={<Playlist />} />
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route path="/profile" element={<Navbar/>}/>
      </Routes>
    </Router>
  );
}
