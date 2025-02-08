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
        
        <Route path="/" element={<Playlist />} />
        <Route path="/profile" element={<Navbar/>}/>
      </Routes>
    </Router>
  );
}
