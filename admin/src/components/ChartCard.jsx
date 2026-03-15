// admin/src/components/ChartCard.jsx
const ChartCard = ({ title, children }) => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        {children}
      </div>

      <style jsx>{`
        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .chart-title {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .chart-content {
          width: 100%;
          height: 300px;
        }

        @media (max-width: 768px) {
          .chart-card {
            padding: 1rem;
          }

          .chart-content {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChartCard;