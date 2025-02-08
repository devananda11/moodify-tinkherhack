import { MusicIcon } from "lucide-react"
import SpotifyLoginButton from "@/components/spotify-login-button"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-black">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-6 m-auto">
        <div className="flex items-center justify-center w-16 h-16 bg-spotify-green rounded-full mb-4">
          <MusicIcon className="w-8 h-8 text-black" />
        </div>
        <h1 className="mb-6 text-3xl font-bold text-white text-center">Mood Music</h1>
        <p className="mb-8 text-sm text-gray-400 text-center">Discover music that matches your mood.</p>
        <SpotifyLoginButton />
      </div>
    </div>
  )
}

