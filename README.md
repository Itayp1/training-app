# Training App

A full-stack training application for tracking workout routines, exercises, and progress over time.

## Features

### Frontend (React + Vite)
- **Home Page**: Select between Training Day A and Training Day B
- **Training Day View**: 
  - Add exercises with sets, weights, and reps
  - View previous workout references
  - Save workouts for future reference
  - Delete exercises
- **Progress Tracking**: 
  - View exercise history with charts
  - Track progress over time using Chart.js
  - See statistics (max weight, total sessions, volume, etc.)

### Backend (Express)
- RESTful API with JSON file database
- CRUD operations for training days and exercises
- Historical data tracking
- Workout saving and retrieval
- Progress tracking endpoints

## Tech Stack

**Frontend:**
- React 18
- Vite
- React Router DOM (navigation)
- Axios (API calls)
- Chart.js + react-chartjs-2 (progress visualization)

**Backend:**
- Node.js
- Express
- CORS
- Body Parser
- JSON file-based database

## Project Structure

```
training-app/
├── backend/
│   ├── server.js          # Express server with all routes
│   ├── data.json          # JSON database (auto-generated)
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Home page
│   │   │   ├── TrainingDay.jsx    # Training day page
│   │   │   └── Progress.jsx       # Progress tracking page
│   │   ├── App.jsx                # Main app component with routing
│   │   ├── api.js                 # API service layer
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd training-app
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```
The backend will run on http://localhost:5000

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:3000

3. Open your browser and navigate to http://localhost:3000

## API Endpoints

### Training Days
- `GET /api/training-days` - Get all training days
- `GET /api/training-days/:day` - Get specific training day
- `POST /api/training-days/:day` - Create/update training day
- `DELETE /api/training-days/:day` - Delete training day

### Exercises
- `POST /api/training-days/:day/exercises` - Add exercise to training day
- `PUT /api/exercises/:id` - Update exercise
- `DELETE /api/exercises/:id` - Delete exercise
- `GET /api/exercises` - Get all unique exercise names
- `GET /api/exercises/:name/history` - Get exercise history for progress tracking

### Workouts
- `POST /api/workouts` - Save workout
- `GET /api/workouts` - Get all workouts (optional ?day=A filter)
- `GET /api/workouts/last/:day` - Get last workout for a specific day

### Health Check
- `GET /api/health` - Health check endpoint

## Usage

1. **Select Training Day**: On the home page, choose either Training Day A or B
2. **Add Exercises**: Click "Add Exercise" and fill in the exercise details (name, sets, reps, weight)
3. **View Previous Workout**: See your last workout as a reference at the top of the page
4. **Save Workout**: After completing your exercises, click "Save Workout" to store it for future reference
5. **Track Progress**: Click on "View Progress" for any exercise or use the Progress page to see charts and statistics

## Features Explained

### Training Days
The app supports two training days (A and B), allowing you to organize your workouts into different routines.

### Exercise Tracking
Each exercise includes:
- Name
- Number of sets
- Number of reps per set
- Weight used

### Progress Visualization
The Progress page shows:
- Line charts for weight progression
- Total volume (sets × reps × weight) over time
- Statistics including max weight, total sessions, and max volume
- Complete history table

## Database Structure

The `data.json` file stores:
```json
{
  "trainingDays": {
    "A": {
      "day": "A",
      "exercises": [...],
      "lastUpdated": "ISO date"
    }
  },
  "exercises": {
    "exerciseName": [...]
  },
  "workoutHistory": [...]
}
```

## Development

### Adding New Features
1. Backend: Add routes in `backend/server.js`
2. Frontend: Create new pages in `frontend/src/pages/` or components
3. API: Update `frontend/src/api.js` with new endpoints

### Customization
- Modify colors in CSS files
- Add more training days by extending the home page
- Add more statistics to the Progress page
- Implement user authentication
- Add more chart types

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!
