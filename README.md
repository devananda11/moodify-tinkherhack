# **Moodify**

## **Project Overview**
Moodify is a web application that allows users to log in using **Spotify Authentication**, analyze their mood based on text input using the **Hugging Face RoBERTa API**, and receive song recommendations using **RapidAPI**. Users can review the suggested songs, remove unwanted ones, and save the final playlist directly to their **Spotify account**.

---

## **Main Functionalities**
- **Spotify Authentication**: Users log in using their **Spotify account**.
- **Mood Analysis**: Users enter how they feel, and the app analyzes their emotion using **Hugging Face RoBERTa API**.
- **Song Recommendations**: Based on the mood detected, the app fetches **recommended songs** via **RapidAPI**.
- **Playlist Management**:
  - Users can remove suggested songs before finalizing their playlist.
  - Users can save the final selection directly to **Spotify**.

---

## **Tech Stack / Technologies Used**
- **Frontend**: React, Vite, Tailwind CSS
- **Authentication**: Spotify OAuth 2.0
- **APIs Used**:
  - **Spotify API** (for login, saving playlists, and opening them in Spotify)
  - **Hugging Face RoBERTa API** (for mood analysis)
  - **RapidAPI** (for song recommendations)
- **Backend**: No backend (fully client-side application)
- **Hosting**: Vercel

---

## **How to Set Up Locally**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/devananda11/moodify.git
cd moodify
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a **.env** file in the root folder and add:
```ini
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=https://your-deployed-url.vercel.app/
VITE_RAPIDAPI_KEY=your_rapidapi_key
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### **4️⃣ Run the Project Locally**
```sh
npm run dev
```
Then open **http://localhost:5173/** in your browser.

---

## **Bugs / Issues / Known Errors**
### **1️⃣ Spotify API Restrictions**
- Only **whitelisted users** can log in unless the app is approved for **Production Mode**.
- Fix: Add testers in **Spotify Developer Dashboard** or request **Go Live** approval.

### **2️⃣ "INVALID REDIRECT URI" Error**
- Happens when the **redirect URI** in **Spotify Developer Dashboard** does not match the one in your `.env` file.
- Fix: Ensure the **Redirect URI in Spotify settings** matches exactly with the `.env` variable.

### **3️⃣ Hugging Face API Rate Limits**
- Free-tier Hugging Face API **sometimes returns 503 errors** due to high traffic.
- Fix: Upgrade to a **paid plan** or switch to an alternative sentiment analysis API.

### **4️⃣ Song Recommendation Fails**
- RapidAPI limits requests per minute; exceeding this **results in errors**.
- Fix: Add **error handling** and retry logic.

---

## **Screenshots**
📸 **Login Page:** _(User logs in using Spotify)_

📸 **Mood Analysis Page:** _(User enters their mood, and API detects emotion)_

📸 **Song Suggestions Page:** _(User sees recommended songs and can delete unwanted ones)_

📸 **Final Playlist Page:** _(User saves the final selection to Spotify)_

_(Add screenshots when available)_

---

🚀 **Moodify is now live at:** [https://moodify-rho.vercel.app/](https://moodify-rho.vercel.app/) 🎵

