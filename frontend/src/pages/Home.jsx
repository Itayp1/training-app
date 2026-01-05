import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <h1 className="page-title">Select Training Day</h1>
      
      <div className="training-days">
        <Link to="/training/A" className="training-day-card">
          <div className="day-letter">A</div>
          <div className="day-label">Training Day A</div>
        </Link>
        
        <Link to="/training/B" className="training-day-card">
          <div className="day-letter">B</div>
          <div className="day-label">Training Day B</div>
        </Link>
      </div>
      
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <Link to="/progress" className="btn btn-secondary">
          View Progress
        </Link>
      </div>
    </div>
  );
}

export default Home;
