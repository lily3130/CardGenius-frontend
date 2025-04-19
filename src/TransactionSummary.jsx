import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function TransactionSummary({ summary, hideTitle = false }) {
  if (!summary || !summary.by_category) {
    return <p>No summary data available.</p>;
  }

  const categoryLabels = Object.keys(summary.by_category);
  const categoryValues = Object.values(summary.by_category).map(parseFloat);

  const data = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Spending by Category',
        data: categoryValues,
        backgroundColor: [
          '#6a5acd', '#f39c12', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6',
          '#16a085', '#f1c40f', '#d35400', '#1abc9c', '#34495e'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', marginTop: '20px' }}>
      {!hideTitle && <h3 style={{ textAlign: 'center' }}>Spending Overview</h3>}
      <Pie data={data} />
    </div>
  );
}

export default TransactionSummary;
