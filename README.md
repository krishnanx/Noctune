
# Noctune

Arent we all tired of expensive subscriptions and the hassle of downloading songs?
Noctune is the solution to our problem.
The idea is to provide Free music streaming to all.
Noctune gives you access to everything you could dream of—without the cost.

Stay tune to know more!

## Tech stack
- React Native
- Express js
- Fast api
- Supabase
  

### ML-Powered Music App – Feature Checklist & Steps

---

### FEATURE SET

#### 1. User Preferences System
- Store user-selected:
  - 🎵 Music Language (Hindi, English, etc.)
  - 🎧 Genre (Romantic, Sad, Pop, Metal, etc.)

#### 2. Smart Search Behavior Tracking
- Capture user **search queries**
- Extract and store keywords (genre, language, artist)

#### 3. Click Behavior Scoring
- If user **plays** a song after searching → strong boost
- If user **skips** it → weak or no boost

#### 4. Personalized Recommendation System
- Use stored preferences to:
  - Recommend new songs using **similarity**
  - Rank them by user’s top genres/languages/artists

---

### 🛠️ IMPLEMENTATION STEPS

---

#### ⚙️ FRONTEND (React Native + Expo AV)
1. **Search bar** for user input
2. **Trigger music fetch** from backend (via keyword or URL)
3. When user **plays** a track, send that action to backend:
   ```json
   {
     "user_id": "123",
     "search_query": "romantic hindi arijit singh",
     "played": true
   }
   ```

---

#### BACKEND (Python FastAPI)

**3. Parse the Search Query**
- Extract:
  - Genres (from a known list)
  - Languages
  - Remaining = artist name
- (Use basic NLP or keyword matching)

**4. Update User Preference Profile**
- Boost score based on `played == true`
- Store/update the user profile in DB

---

#### DATABASE (Supabase)

**5. User Profile Structure**
```json
{
  "user_id": "123",
  "preferences": {
    "genre": { "romantic": 6 },
    "language": { "hindi": 5 },
    "artist": { "arijit singh": 8 }
  }
}
```

---

#### ML / RECOMMENDER LOGIC

**6. Fetch Recommendations**
- For a given user:
  - Fetch their preferences
  - Fetch metadata of available songs
  - Match user preferences to song metadata using:
    - Cosine similarity
    - Rule-based filtering
    - kNN or clustering

---

### OPTIONAL NEXT FEATURES

- Add a **"Like"/"Skip"** button to fine-tune feedback
- Build **mood detection** from lyrics/audio
- Add **trending/popular** recommendations
- Implement **collaborative filtering** with more user data
