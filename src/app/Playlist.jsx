import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music2, Loader2, Plus, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const EMOTION_TO_MOOD = {
  joy: "happy",
  sadness: "sad",
  anger: "anger",
  fear: "fear",
  surprise: "surprise",
  love: "neutral",
  neutral: "neutral",
  disgust: "disgust"
};

const MOOD_CONFIGS = {
  happy: {
    seed_tracks: '1h6gqPefhCPh4s5v0POWrj',
    seed_genres: 'pop,dance',
    seed_artists: '2DaxqgrOhkeH0fpeiQq2f4',
    playlistName: 'Happy Vibes'
  },
  sad: {
    seed_tracks: '2gMXnyrvIjhVBUZwvLZDMP',
    seed_genres: 'sad,indie',
    seed_artists: '4IWBUUAFIplrNtaOHcJPRM',
    playlistName: 'Melancholy Mix'
  },
  anger: {
    seed_tracks: '3sNx9xH7oiB6KDpW0MlHYt',
    seed_genres: 'metal,rock',
    seed_artists: '6DEjYFkNZh67HP7R9PSZvv',
    playlistName: 'Anger Release'
  },
  fear: {
    seed_tracks: '2Fu7Hxfk4M6F8n0PDh8cRz',
    seed_genres: 'dark,cinematic',
    seed_artists: '3fMbdgg4jU18AjLCKBhRSm',
    playlistName: 'Calming Fears'
  },
  surprise: {
    seed_tracks: '4sPMc4DsiD311XxyTLjGGe',
    seed_genres: 'electronic,experimental',
    seed_artists: '6qqNVTkY8uBg9cP3Jd7DAH',
    playlistName: 'Surprise Mix'
  },
  neutral: {
    seed_tracks: '1G391cbiT3v3Cywg8T7DM1',
    seed_genres: 'pop,acoustic',
    seed_artists: '6eUKZXaKkcviH0Ku9w2n3V',
    playlistName: 'Balanced Beats'
  },
  disgust: {
    seed_tracks: '1N4RlgUCtlwJtMsygWGhoy',
    seed_genres: 'grunge,alternative',
    seed_artists: '2xiIXseIJcq3nG7C8fHeBj',
    playlistName: 'Mood Shifter'
  }
};

const IntegratedEmotionPlaylist = () => {
  const [text, setText] = useState('');
  const [mood, setMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
      setAccessToken(token);
      localStorage.setItem("spotify_access_token", token);
      window.location.hash = '';
    } else {
      const storedToken = localStorage.getItem("spotify_access_token");
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, []);
  const deleteSong = (trackId) => {
    setRecommendations((prev) => prev.filter((track) => track.id !== trackId));
  };

  const analyzeMood = async (text) => {
    setLoading(true);
    setError('');
    setPlaylistUrl('');
    
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (!response.ok) throw new Error('Failed to analyze mood');

      const result = await response.json();
      
      const topEmotion = result[0].reduce((max, current) => 
        current.score > max.score ? current : max
      );

      const detectedMood = EMOTION_TO_MOOD[topEmotion.label.toLowerCase()] || 'neutral';
      setMood(detectedMood);

      await getRecommendations(detectedMood);
      
    } catch (error) {
      console.error('Error analyzing mood:', error);
      setError('Failed to analyze mood. Please try again.');
      toast({
        title: "Error",
        description: "Failed to analyze mood. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async (mood) => {
    if (!MOOD_CONFIGS[mood]) return;
    
    try {
      const response = await axios.get('https://spotify23.p.rapidapi.com/recommendations/', {
        params: { limit: '5', ...MOOD_CONFIGS[mood] },
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
          'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
      });

      setRecommendations(response.data.tracks || []);
      
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to fetch song recommendations. Try again later.');
      toast({
        title: "Error",
        description: "Failed to fetch song recommendations. Please try again.",
        variant: "destructive"
      });
    }
  };

  const createPlaylist = async () => {
    if (!accessToken || !mood || recommendations.length === 0) {
      toast({
        title: "Error",
        description: "Missing required data to create playlist.",
        variant: "destructive"
      });
      return;
    }

    try {
      const userResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const userId = userResponse.data.id;

      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: MOOD_CONFIGS[mood].playlistName,
          description: `A playlist generated based on your ${mood} mood`,
          public: false
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const playlistId = playlistResponse.data.id;
      setPlaylistUrl(playlistResponse.data.external_urls.spotify);

      const trackUris = recommendations.map(track => track.uri);
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: trackUris },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Success!",
        description: "Playlist created and songs added successfully.",
      });

    } catch (error) {
      console.error("Error creating playlist:", error);
      toast({
        title: "Error",
        description: "Failed to create playlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) analyzeMood(text);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#1DB954] p-4">
    
      <div className="flex items-center gap-3 mb-12 mt-8">
        <Music2 className="w-12 h-12 text-white" />
        <div className="text-4xl font-bold text-white">Emotion-Based Playlist Generator</div>
      </div>

      <Card className="w-full max-w-2xl bg-white shadow-lg border-0">
        <CardContent className="flex flex-col items-center p-8 space-y-8">
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="How are you feeling? Share your thoughts..."
              className="w-full p-4 border rounded-lg min-h-32 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
            
            <Button
              type="submit"
              disabled={!text.trim() || loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {loading ? 'Analyzing...' : 'Analyze & Get Songs'}
            </Button>
          </form>

          {error && (
            <div className="w-full p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {mood && (
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2">Detected Mood:</h3>
              <div className="p-3 bg-green-100 rounded-lg text-lg font-medium text-white">
                {mood.toUpperCase()}
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Recommended Songs:
                </h3>
                <Button
                  onClick={createPlaylist}
                  disabled={!accessToken}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Playlist
                </Button>
              </div>

              {playlistUrl && (
                <Button
                  onClick={() => window.open(playlistUrl, '_blank')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Playlist in Spotify
                </Button>
              )}

              {recommendations.map((track, index) => (
                <Card key={index} className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4 justify-between w-full">
                    <div className="flex items-center gap-4">
                        {track.album?.images?.[0]?.url ? (
                            <img 
                                src={track.album.images[0].url} 
                                alt={track.name}
                                className="w-12 h-12 rounded-md object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                <Music2 className="w-6 h-6 text-gray-500" />
                            </div>
                        )}
                        <div>
                            <div className="font-medium text-gray-900">{track.name}</div>
                            <div className="text-sm text-gray-500">
                                {track.artists?.map(artist => artist.name).join(', ')}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => deleteSong(track.id)}
                        className="text-red-500 hover:text-red-700 transition"
                    >
                        🗑 Delete
                    </button>
                </div>

                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-8 text-white text-sm">
        Powered by HuggingFace & Spotify API
      </p>
    </div>
  );
};

export default IntegratedEmotionPlaylist;