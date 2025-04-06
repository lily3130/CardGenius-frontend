import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function TransactionSummary({ transactions, hideTitle = false}) {
  const categoryMap = {};

  transactions.forEach((tx) => {
    if (!categoryMap[tx.category]) {
      categoryMap[tx.category] = 0;
    }
    categoryMap[tx.category] += Number(tx.amount);
  });

  const data = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(categoryMap),
        backgroundColor: [
          '#6a5acd', '#f39c12', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6'
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
