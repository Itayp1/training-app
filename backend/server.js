const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database file if it doesn't exist
async function initializeDatabase() {
  try {
    await fs.access(DB_FILE);
  } catch (error) {
    const initialData = {
      trainingDays: {},
      exercises: {},
      workoutHistory: []
    };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log('Database initialized');
  }
}

// Read database
async function readDatabase() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { trainingDays: {}, exercises: {}, workoutHistory: [] };
  }
}

// Write database
async function writeDatabase(data) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}

// Routes

// Get all training days
app.get('/api/training-days', async (req, res) => {
  try {
    const db = await readDatabase();
    res.json(db.trainingDays);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch training days' });
  }
});

// Get a specific training day
app.get('/api/training-days/:day', async (req, res) => {
  try {
    const db = await readDatabase();
    const day = req.params.day;
    
    if (!db.trainingDays[day]) {
      return res.status(404).json({ error: 'Training day not found' });
    }
    
    res.json(db.trainingDays[day]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch training day' });
  }
});

// Create or update a training day
app.post('/api/training-days/:day', async (req, res) => {
  try {
    const db = await readDatabase();
    const day = req.params.day;
    const { exercises } = req.body;
    
    db.trainingDays[day] = {
      day,
      exercises: exercises || [],
      lastUpdated: new Date().toISOString()
    };
    
    await writeDatabase(db);
    res.json(db.trainingDays[day]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save training day' });
  }
});

// Delete a training day
app.delete('/api/training-days/:day', async (req, res) => {
  try {
    const db = await readDatabase();
    const day = req.params.day;
    
    if (!db.trainingDays[day]) {
      return res.status(404).json({ error: 'Training day not found' });
    }
    
    delete db.trainingDays[day];
    await writeDatabase(db);
    res.json({ message: 'Training day deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete training day' });
  }
});

// Add exercise to training day
app.post('/api/training-days/:day/exercises', async (req, res) => {
  try {
    const db = await readDatabase();
    const day = req.params.day;
    const exercise = req.body;
    
    if (!db.trainingDays[day]) {
      db.trainingDays[day] = {
        day,
        exercises: [],
        lastUpdated: new Date().toISOString()
      };
    }
    
    const exerciseId = `${day}-${Date.now()}`;
    const newExercise = {
      id: exerciseId,
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      createdAt: new Date().toISOString()
    };
    
    db.trainingDays[day].exercises.push(newExercise);
    db.trainingDays[day].lastUpdated = new Date().toISOString();
    
    // Store exercise in exercises collection for tracking
    if (!db.exercises[exercise.name]) {
      db.exercises[exercise.name] = [];
    }
    db.exercises[exercise.name].push({
      ...newExercise,
      day
    });
    
    await writeDatabase(db);
    res.json(newExercise);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add exercise' });
  }
});

// Update exercise
app.put('/api/exercises/:id', async (req, res) => {
  try {
    const db = await readDatabase();
    const exerciseId = req.params.id;
    const updates = req.body;
    
    let found = false;
    
    // Update in training days
    for (const day in db.trainingDays) {
      const exerciseIndex = db.trainingDays[day].exercises.findIndex(
        e => e.id === exerciseId
      );
      
      if (exerciseIndex !== -1) {
        db.trainingDays[day].exercises[exerciseIndex] = {
          ...db.trainingDays[day].exercises[exerciseIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        db.trainingDays[day].lastUpdated = new Date().toISOString();
        found = true;
        
        // Update in exercises collection
        const exerciseName = db.trainingDays[day].exercises[exerciseIndex].name;
        if (db.exercises[exerciseName]) {
          const exIndex = db.exercises[exerciseName].findIndex(e => e.id === exerciseId);
          if (exIndex !== -1) {
            db.exercises[exerciseName][exIndex] = {
              ...db.exercises[exerciseName][exIndex],
              ...updates,
              updatedAt: new Date().toISOString()
            };
          }
        }
        
        break;
      }
    }
    
    if (!found) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    await writeDatabase(db);
    res.json({ message: 'Exercise updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update exercise' });
  }
});

// Delete exercise
app.delete('/api/exercises/:id', async (req, res) => {
  try {
    const db = await readDatabase();
    const exerciseId = req.params.id;
    
    let found = false;
    
    // Remove from training days
    for (const day in db.trainingDays) {
      const exerciseIndex = db.trainingDays[day].exercises.findIndex(
        e => e.id === exerciseId
      );
      
      if (exerciseIndex !== -1) {
        const exerciseName = db.trainingDays[day].exercises[exerciseIndex].name;
        db.trainingDays[day].exercises.splice(exerciseIndex, 1);
        db.trainingDays[day].lastUpdated = new Date().toISOString();
        found = true;
        
        // Remove from exercises collection
        if (db.exercises[exerciseName]) {
          db.exercises[exerciseName] = db.exercises[exerciseName].filter(
            e => e.id !== exerciseId
          );
        }
        
        break;
      }
    }
    
    if (!found) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    await writeDatabase(db);
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
});

// Get exercise history (progress tracking)
app.get('/api/exercises/:name/history', async (req, res) => {
  try {
    const db = await readDatabase();
    const exerciseName = req.params.name;
    
    const history = db.exercises[exerciseName] || [];
    
    // Sort by date
    history.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercise history' });
  }
});

// Get all unique exercise names
app.get('/api/exercises', async (req, res) => {
  try {
    const db = await readDatabase();
    const exerciseNames = Object.keys(db.exercises);
    res.json(exerciseNames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// Save workout (copy for future reference)
app.post('/api/workouts', async (req, res) => {
  try {
    const db = await readDatabase();
    const workout = {
      id: Date.now(),
      day: req.body.day,
      exercises: req.body.exercises,
      date: new Date().toISOString()
    };
    
    db.workoutHistory.push(workout);
    await writeDatabase(db);
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save workout' });
  }
});

// Get workout history
app.get('/api/workouts', async (req, res) => {
  try {
    const db = await readDatabase();
    const { day } = req.query;
    
    let workouts = db.workoutHistory;
    
    if (day) {
      workouts = workouts.filter(w => w.day === day);
    }
    
    // Sort by date (most recent first)
    workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workout history' });
  }
});

// Get last workout for a specific day
app.get('/api/workouts/last/:day', async (req, res) => {
  try {
    const db = await readDatabase();
    const day = req.params.day;
    
    const dayWorkouts = db.workoutHistory.filter(w => w.day === day);
    dayWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (dayWorkouts.length === 0) {
      return res.status(404).json({ error: 'No previous workouts found' });
    }
    
    res.json(dayWorkouts[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch last workout' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
