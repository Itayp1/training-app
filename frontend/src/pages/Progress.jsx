import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getAllExercises, getExerciseHistory } from '../api';
import './Progress.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Progress() {
  const [searchParams] = useSearchParams();
  const preselectedExercise = searchParams.get('exercise');
  
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(preselectedExercise || '');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      loadExerciseHistory();
    }
  }, [selectedExercise]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const response = await getAllExercises();
      setExercises(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  const loadExerciseHistory = async () => {
    try {
      setLoading(true);
      const response = await getExerciseHistory(selectedExercise);
      setHistory(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load exercise history');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: history.map((entry, idx) => 
      entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : `Session ${idx + 1}`
    ),
    datasets: [
      {
        label: 'Weight (kg)',
        data: history.map(entry => entry.weight),
        borderColor: 'rgb(100, 108, 255)',
        backgroundColor: 'rgba(100, 108, 255, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Total Volume (sets × reps × weight)',
        data: history.map(entry => entry.sets * entry.reps * entry.weight),
        borderColor: 'rgb(118, 75, 162)',
        backgroundColor: 'rgba(118, 75, 162, 0.5)',
        tension: 0.3,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Progress: ${selectedExercise}`,
        color: '#fff',
        font: {
          size: 18
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff'
        },
        grid: {
          color: '#333'
        }
      },
      x: {
        ticks: {
          color: '#fff'
        },
        grid: {
          color: '#333'
        }
      }
    }
  };

  if (loading && exercises.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="progress">
      <div className="page-header">
        <h1 className="page-title">Progress Tracking</h1>
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div className="form-group">
          <label>Select Exercise</label>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            <option value="">-- Choose an exercise --</option>
            {exercises.map((exercise) => (
              <option key={exercise} value={exercise}>
                {exercise}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedExercise && history.length > 0 && (
        <>
          <div className="card chart-container">
            <div className="chart-wrapper">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="card">
            <h3>Exercise History</h3>
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Sets</th>
                    <th>Reps</th>
                    <th>Weight (kg)</th>
                    <th>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, idx) => (
                    <tr key={idx}>
                      <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                      <td>{entry.day}</td>
                      <td>{entry.sets}</td>
                      <td>{entry.reps}</td>
                      <td>{entry.weight}</td>
                      <td>{entry.sets * entry.reps * entry.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card stats">
            <h3>Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Total Sessions</div>
                <div className="stat-value">{history.length}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Max Weight</div>
                <div className="stat-value">
                  {Math.max(...history.map(h => h.weight))} kg
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Latest Weight</div>
                <div className="stat-value">
                  {history[history.length - 1]?.weight} kg
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Max Volume</div>
                <div className="stat-value">
                  {Math.max(...history.map(h => h.sets * h.reps * h.weight))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedExercise && history.length === 0 && !loading && (
        <div className="card empty-state">
          <p>No history found for this exercise yet.</p>
        </div>
      )}

      {!selectedExercise && (
        <div className="card empty-state">
          <p>Select an exercise to view progress and statistics.</p>
        </div>
      )}
    </div>
  );
}

export default Progress;
