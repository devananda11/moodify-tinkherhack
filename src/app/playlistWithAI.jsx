import React, { useState } from 'react';
import axios from 'axios';

const EMOTION_TO_MOOD = {
  joy: "happy",
  sadness: "sad",
  anger: "anger",
  fear: "fear",
  surprise: "surprise",
  love: "neutral",  // No direct equivalent, mapping to neutral
  neutral: "neutral",
  disgust: "disgust"
};

const MOOD_CONFIGS = {
  happy: {
    seed_tracks: '1h6gqPefhCPh4s5v0POWrj', // "Happy" by Pharrell Williams
    seed_genres: 'pop,dance',
    seed_artists: '2DaxqgrOhkeH0fpeiQq2f4' // Pharrell Williams
  },
  sad: {
    seed_tracks: '2gMXnyrvIjhVBUZwvLZDMP', // "Let Me Down Slowly" by Alec Benjamin
    seed_genres: 'sad,indie',
    seed_artists: '4IWBUUAFIplrNtaOHcJPRM' // Alec Benjamin
  },
  anger: {
    seed_tracks: '3sNx9xH7oiB6KDpW0MlHYt', // "Break Stuff" - Limp Bizkit
    seed_genres: 'metal,rock',
    seed_artists: '6DEjYFkNZh67HP7R9PSZvv' // Limp Bizkit
  },
  disgust: {
    seed_tracks: '1N4RlgUCtlwJtMsygWGhoy', // "I Hate Everything About You" - Three Days Grace
    seed_genres: 'grunge,alternative',
    seed_artists: '2xiIXseIJcq3nG7C8fHeBj' // Three Days Grace
  },
  fear: {
    seed_tracks: '2Fu7Hxfk4M6F8n0PDh8cRz', // "Thriller" - Michael Jackson
    seed_genres: 'dark,cinematic',
    seed_artists: '3fMbdgg4jU18AjLCKBhRSm' // Michael Jackson
  },
  surprise: {
    seed_tracks: '4sPMc4DsiD311XxyTLjGGe', // "Bad Guy" - Billie Eilish
    seed_genres: 'electronic,experimental',
    seed_artists: '6qqNVTkY8uBg9cP3Jd7DAH' // Billie Eilish
  },
  neutral: {
    seed_tracks: '1G391cbiT3v3Cywg8T7DM1', // "Shape of You" - Ed Sheeran
    seed_genres: 'pop,acoustic',
    seed_artists: '6eUKZXaKkcviH0Ku9w2n3V' // Ed Sheeran
  }
};

const EmotionAnalyzer = () => {
  const [text, setText] = useState('');
  const [mood, setMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeMood = async (text) => {
    setIsLoading(true);
    setError('');
    
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
      
      // Find the highest-scoring emotion
      const topEmotion = result[0].reduce((max, current) => 
        current.score > max.score ? current : max
      );

      const detectedMood = EMOTION_TO_MOOD[topEmotion.label.toLowerCase()] || 'neutral';
      setMood(detectedMood);

      // Fetch song recommendations
      fetchRecommendations(detectedMood);
      
    } catch (error) {
      console.error('Error analyzing mood:', error);
      setError('Failed to analyze mood. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async (mood) => {
    if (!MOOD_CONFIGS[mood]) return;
    
    setIsLoading(true);
    setError('');
    
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) analyzeMood(text);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Emotion & Music Recommender</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here to analyze emotions..."
          className="w-full p-2 border rounded-md min-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze & Get Songs'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {mood && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Detected Mood:</h3>
          <p className="p-3 bg-gray-200 rounded-md text-lg font-medium">{mood.toUpperCase()}</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Recommended Songs:</h3>
          {recommendations.map((track, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-md flex items-center gap-4">
              <img src={track.album.images[0]?.url} alt={track.name} className="w-12 h-12 rounded-md"/>
              <div>
                <p className="font-medium">{track.name}</p>
                <p className="text-sm text-gray-600">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmotionAnalyzer;