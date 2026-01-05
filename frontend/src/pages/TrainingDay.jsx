import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getTrainingDay,
  addExercise,
  deleteExercise,
  getLastWorkout,
  saveWorkout
} from '../api';
import './TrainingDay.css';

function TrainingDay() {
  const { day } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastWorkout, setLastWorkout] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  useEffect(() => {
    loadTrainingDay();
    loadLastWorkout();
  }, [day]);

  const loadTrainingDay = async () => {
    try {
      setLoading(true);
      const response = await getTrainingDay(day);
      setExercises(response.data.exercises || []);
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setExercises([]);
      } else {
        setError('Failed to load training day');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLastWorkout = async () => {
    try {
      const response = await getLastWorkout(day);
      setLastWorkout(response.data);
    } catch (err) {
      // No previous workout found
      setLastWorkout(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addExercise(day, {
        name: formData.name,
        sets: parseInt(formData.sets),
        reps: parseInt(formData.reps),
        weight: parseFloat(formData.weight)
      });
      setExercises([...exercises, response.data]);
      setFormData({ name: '', sets: '', reps: '', weight: '' });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Failed to add exercise');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this exercise?')) return;
    
    try {
      await deleteExercise(id);
      setExercises(exercises.filter(ex => ex.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete exercise');
    }
  };

  const handleSaveWorkout = async () => {
    if (exercises.length === 0) {
      alert('No exercises to save!');
      return;
    }
    
    try {
      await saveWorkout({
        day,
        exercises: exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight
        }))
      });
      alert('Workout saved successfully!');
      loadLastWorkout();
    } catch (err) {
      setError('Failed to save workout');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="training-day">
      <div className="page-header">
        <h1 className="page-title">Training Day {day}</h1>
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
      </div>

      {error && <div className="error">{error}</div>}

      {lastWorkout && (
        <div className="card last-workout">
          <h3>📋 Last Workout Reference</h3>
          <p className="workout-date">
            {new Date(lastWorkout.date).toLocaleDateString()}
          </p>
          <div className="exercise-list">
            {lastWorkout.exercises.map((ex, idx) => (
              <div key={idx} className="exercise-reference">
                <strong>{ex.name}</strong>: {ex.sets} sets × {ex.reps} reps @ {ex.weight} kg
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="actions">
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Exercise'}
        </button>
        {exercises.length > 0 && (
          <button className="btn btn-secondary" onClick={handleSaveWorkout}>
            💾 Save Workout
          </button>
        )}
      </div>

      {showForm && (
        <div className="card exercise-form">
          <h3>Add New Exercise</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Exercise Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Sets</label>
                <input
                  type="number"
                  name="sets"
                  value={formData.sets}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Reps</label>
                <input
                  type="number"
                  name="reps"
                  value={formData.reps}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.5"
                  min="0"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn">Add Exercise</button>
          </form>
        </div>
      )}

      <div className="current-workout">
        <h2>Today's Exercises</h2>
        {exercises.length === 0 ? (
          <p className="empty-state">No exercises added yet. Click "Add Exercise" to get started!</p>
        ) : (
          <div className="exercise-cards">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="card exercise-card">
                <div className="exercise-header">
                  <h3>{exercise.name}</h3>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(exercise.id)}
                  >
                    🗑️
                  </button>
                </div>
                <div className="exercise-details">
                  <span className="detail-item">
                    <strong>Sets:</strong> {exercise.sets}
                  </span>
                  <span className="detail-item">
                    <strong>Reps:</strong> {exercise.reps}
                  </span>
                  <span className="detail-item">
                    <strong>Weight:</strong> {exercise.weight} kg
                  </span>
                </div>
                <Link
                  to={`/progress?exercise=${encodeURIComponent(exercise.name)}`}
                  className="view-progress-link"
                >
                  📊 View Progress
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainingDay;
