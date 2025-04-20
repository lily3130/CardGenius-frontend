import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function TransactionSummary({ summary, hideTitle = false }) {
  const typeData = summary?.by_type;
  
  if (!typeData || Object.keys(typeData).length === 0) {
    return <p style={{ textAlign: 'center' }}>No summary data available.</p>;
  }

  const labels = Object.keys(typeData);
  const values = labels.map(label => parseFloat(typeData[label]) || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Spending by Type',
        data: values,
        backgroundColor: [
          '#6a5acd', '#f39c12', '#2ecc71', '#e74c3c', '#9b59b6', '#34495e'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', marginTop: '20px' }}>
      {!hideTitle && <h3 style={{ textAlign: 'center' }}>Spending by Type</h3>}
      <Pie data={data} />
    </div>
  );
}

export default TransactionSummary;
