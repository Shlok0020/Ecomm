// admin/src/components/StatsCard.jsx
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatsCard = ({ title, value, icon, color, trend }) => {
  const trendIcon = trend >= 0 ? <FaArrowUp /> : <FaArrowDown />;
  const trendColor = trend >= 0 ? '#10b981' : '#ef4444';

  return (
    <div className="stats-card">
      <div className="card-left">
        <div className="card-icon" style={{ background: color }}>
          {icon}
        </div>
      </div>
      <div className="card-right">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
        {trend !== undefined && (
          <div className="card-trend" style={{ color: trendColor }}>
            {trendIcon} {Math.abs(trend)}% from last month
          </div>
        )}
      </div>

      <style jsx>{`
        .stats-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .stats-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(201,169,110,0.2);
        }

        .card-left {
          flex-shrink: 0;
        }

        .card-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          color: white;
        }

        .card-right {
          flex: 1;
        }

        .card-title {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.3rem;
          font-weight: 500;
        }

        .card-value {
          font-size: 1.8rem;
          font-weight: 600;
          color: #111;
          margin-bottom: 0.2rem;
        }

        .card-trend {
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        @media (max-width: 768px) {
          .stats-card {
            padding: 1rem;
          }

          .card-icon {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }

          .card-value {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StatsCard;