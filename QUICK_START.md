# Quick Start Guide

## Installation

1. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. **Start the Backend Server (Terminal 1):**
   ```bash
   cd backend
   npm start
   ```
   Backend will run on http://localhost:5000

2. **Start the Frontend Dev Server (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:3000

3. **Open your browser** and navigate to http://localhost:3000

## Usage Guide

### 1. Select a Training Day
- From the home page, click on either "Training Day A" or "Training Day B"

### 2. Add Exercises
- Click the "+ Add Exercise" button
- Fill in the exercise details:
  - Exercise Name (e.g., "Bench Press", "Squats")
  - Number of Sets
  - Number of Reps per set
  - Weight in kg
- Click "Add Exercise" to save

### 3. Save Your Workout
- After adding all exercises, click "💾 Save Workout"
- This saves the workout for future reference
- Next time you visit this training day, you'll see your last workout at the top

### 4. View Progress
- Click "📊 View Progress" next to any exercise
- Or navigate to the Progress page from the top menu
- Select an exercise from the dropdown
- View:
  - Line charts showing weight and volume progression
  - Complete exercise history table
  - Statistics (total sessions, max weight, etc.)

### 5. Manage Exercises
- Delete exercises by clicking the 🗑️ button
- Add the same exercise multiple times to track progress over sessions

## API Endpoints

### Training Days
- `GET /api/training-days` - Get all training days
- `GET /api/training-days/:day` - Get specific training day
- `POST /api/training-days/:day` - Create/update training day
- `DELETE /api/training-days/:day` - Delete training day

### Exercises
- `POST /api/training-days/:day/exercises` - Add exercise
- `PUT /api/exercises/:id` - Update exercise
- `DELETE /api/exercises/:id` - Delete exercise
- `GET /api/exercises/:name/history` - Get exercise history
- `GET /api/exercises` - Get all exercise names

### Workouts
- `POST /api/workouts` - Save workout
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/last/:day` - Get last workout for day

## Features

✅ Two separate training days (A and B)
✅ Add exercises with sets, reps, and weight
✅ Save complete workouts for reference
✅ View previous workout when starting new session
✅ Track progress over time with charts
✅ See statistics and history for each exercise
✅ Delete exercises you don't need
✅ Responsive design works on mobile

## Database

Data is stored in `backend/data.json` in the following format:
```json
{
  "trainingDays": {},
  "exercises": {},
  "workoutHistory": []
}
```

The file is automatically created on first run and persists all your data.

## Customization Ideas

- Add more training days (C, D, etc.)
- Add exercise categories (Upper body, Lower body, etc.)
- Add workout duration tracking
- Add rest timer between sets
- Add exercise instructions/videos
- Add user authentication
- Export workout history to CSV
- Add workout templates

## Troubleshooting

**Backend not starting:**
- Make sure port 5000 is available
- Check Node.js is installed: `node --version`

**Frontend not connecting to backend:**
- Ensure backend is running first
- Check the proxy configuration in `frontend/vite.config.js`

**Data not persisting:**
- Check that `backend/data.json` is being created
- Verify write permissions in the backend directory

## Technologies Used

- **Frontend:** React 18, Vite, React Router DOM, Axios, Chart.js
- **Backend:** Node.js, Express, CORS
- **Database:** JSON file storage
