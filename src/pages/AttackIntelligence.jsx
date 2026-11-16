import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AttackIntelligence() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/incidents');
        setData(response.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center text-accent animate-pulse text-lg">Loading Analytics...</div>;
  }

  // Group by Attack Category
  const categoryCounts = {};
  data.forEach(d => {
    categoryCounts[d.AttackCategory] = (categoryCounts[d.AttackCategory] || 0) + 1;
  });
  
  const sortedCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);

  // Stacked Chart Data
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const severityColors = { Critical: '#EF4444', High: '#F59E0B', Medium: '#FACC15', Low: '#10B981' };
  
  const stackedDatasets = severities.map(severity => ({
    label: severity,
    data: sortedCategories.map(cat => data.filter(d => d.AttackCategory === cat && d.Severity === severity).length),
    backgroundColor: severityColors[severity],
    borderRadius: 4,
  }));

  const horizontalBarData = {
    labels: sortedCategories,
    datasets: [{
      label: 'Total Incidents',
      data: sortedCategories.map(cat => categoryCounts[cat]),
      backgroundColor: '#3B82F6',
      borderRadius: 6,
    }]
  };

  const stackedBarData = {
    labels: sortedCategories,
    datasets: stackedDatasets,
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Attack Intelligence</h2>
        <p className="text-slate-400 text-sm mt-1">Deep dive into threat categories and their severity distribution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Attack Categories */}
        <div className="bg-card p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Top Attack Categories</h3>
          <div className="relative h-96 w-full">
            <Bar 
              data={horizontalBarData} 
              options={{ 
                indexAxis: 'y', 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: '#1E293B' }, ticks: { color: '#94A3B8' } },
                  y: { grid: { display: false }, ticks: { color: '#CBD5E1', font: { weight: 'bold' } } }
                }
              }} 
            />
          </div>
        </div>

        {/* Severity by Category */}
        <div className="bg-card p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Severity Breakdown by Category</h3>
          <div className="relative h-96 w-full">
            <Bar 
              data={stackedBarData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { position: 'bottom', labels: { color: '#94A3B8', boxWidth: 12 } } 
                },
                scales: {
                  x: { stacked: true, grid: { display: false }, ticks: { color: '#CBD5E1' } },
                  y: { stacked: true, grid: { color: '#1E293B' }, ticks: { color: '#94A3B8' } }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}