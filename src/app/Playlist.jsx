import React, { useState } from 'react';
import axios from 'axios';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { Card, CardContent } from "@/components/ui/card";
import { Music2, Loader2 } from "lucide-react";

const moodConfigs = {
  happy: {
    seed_tracks: '1h6gqPefhCPh4s5v0POWrj', // "Happy" by Pharrell Williams
    seed_genres: 'pop,dance',
    seed_artists: '2DaxqgrOhkeH0fpeiQq2f4' // Pharrell Williams
  },
  sad: {
    seed_tracks: '1BxfuPKGuaTgP7aM0Bbdwr', // "Sad" by XXXTentacion
    seed_genres: 'sad,indie',
    seed_artists: '15UsOTVnJzReFVN1VCnxy4' // XXXTentacion
  },
  calm: {
    seed_tracks: '0GTK6TesV108Jj5D3MHsYb', // "River Flows in You" by Yiruma
    seed_genres: 'ambient,chill',
    seed_artists: '6nxWCVXbOlEVRexSbLsTer' // Yiruma
  }
};

const SpotifyMoodRecommendations = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRecommendations = async (mood) => {
    setLoading(true);
    setError('');
    try {
      const options = {
        method: 'GET',
        url: 'https://spotify23.p.rapidapi.com/recommendations/',
        params: {
          limit: '2',
          ...moodConfigs[mood]
        },
        headers: {
          'x-rapidapi-key': '27e9194535msh27b73b26e3b770dp1344fejsne96175ee6355',
          'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
      };
      
      const response = await axios.request(options);
      setRecommendations(response.data.tracks || []);
    } catch (error) {
      setError('Failed to get recommendations. Please try again.');
      console.error(error);
    }
    setLoading(false);
  };

  const handleMoodChange = (mood) => {
    setSelectedMood(mood);
    getRecommendations(mood);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#1DB954] p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-12 mt-8">
        <Music2 className="w-12 h-12 text-white" />
        <div className="text-4xl font-bold text-white">Mood Music</div>
      </div>

      {/* Main Content Card */}
      <Card className="w-full max-w-md bg-white shadow-lg border-0">
        <CardContent className="flex flex-col items-center p-8 space-y-8">
          <h2 className="text-xl font-semibold text-neutral-900">
            How are you feeling today?
          </h2>

          {/* Mood Selector */}
          <Select onValueChange={handleMoodChange} value={selectedMood}>
            <SelectTrigger className="w-full max-w-xs rounded-full">
              <SelectValue placeholder="Select your mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="happy">Happy 😊</SelectItem>
              <SelectItem value="sad">Sad 😢</SelectItem>
              <SelectItem value="calm">Calm 😌</SelectItem>
            </SelectContent>
          </Select>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="w-full space-y-4">
              <h3 className="text-lg font-medium text-neutral-900">
                Recommended Songs:
              </h3>
              {recommendations.map((track, index) => (
                <Card key={index} className="p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-200 rounded-md flex items-center justify-center">
                      <Music2 className="w-6 h-6 text-neutral-500" />
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{track.name}</div>
                      <div className="text-sm text-neutral-500">
                        {track.artists?.map(artist => artist.name).join(', ')}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-8 text-white text-sm">
        Powered by Spotify API
      </p>
    </div>
  );
};

export default SpotifyMoodRecommendations;