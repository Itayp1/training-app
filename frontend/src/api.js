import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Training Days
export const getTrainingDays = () => api.get('/training-days');
export const getTrainingDay = (day) => api.get(`/training-days/${day}`);
export const createTrainingDay = (day, data) => api.post(`/training-days/${day}`, data);
export const deleteTrainingDay = (day) => api.delete(`/training-days/${day}`);

// Exercises
export const addExercise = (day, exercise) => api.post(`/training-days/${day}/exercises`, exercise);
export const updateExercise = (id, updates) => api.put(`/exercises/${id}`, updates);
export const deleteExercise = (id) => api.delete(`/exercises/${id}`);
export const getExerciseHistory = (name) => api.get(`/exercises/${name}/history`);
export const getAllExercises = () => api.get('/exercises');

// Workouts
export const saveWorkout = (workout) => api.post('/workouts', workout);
export const getWorkouts = (day) => api.get('/workouts', { params: { day } });
export const getLastWorkout = (day) => api.get(`/workouts/last/${day}`);

export default api;
