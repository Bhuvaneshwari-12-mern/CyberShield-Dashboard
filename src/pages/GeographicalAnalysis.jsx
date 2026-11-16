import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Globe, MapPin } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function GeographicalAnalysis() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/incidents');
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-accent animate-pulse p-8">Loading Geo Data...</div>;

  // 1. Process Country Data
  const countryCounts = {};
  data.forEach(d => {
    countryCounts[d.Country] = (countryCounts[d.Country] || 0) + 1;
  });
  const sortedCountries = Object.keys(countryCounts).sort((a, b) => countryCounts[b] - countryCounts[a]);

  // 2. Process Region Data
  const regionCounts = {};
  data.forEach(d => {
    regionCounts[d.Region] = (regionCounts[d.Region] || 0) + 1;
  });
  const regions = Object.keys(regionCounts);

  // Chart Data Configurations
  const countryBarData = {
    labels: sortedCountries,
    datasets: [{
      label: 'Total Incidents',
      data: sortedCountries.map(c => countryCounts[c]),
      backgroundColor: '#06B6D4', // Cyan
      borderRadius: 6,
    }]
  };

  const regionDoughnutData = {
    labels: regions,
    datasets: [{
      data: regions.map(r => regionCounts[r]),
      backgroundColor: ['#3B82F6', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981'],
      borderColor: '#111827',
      borderWidth: 2,
    }]
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Globe className="text-teal" /> Geographical Analysis
        </h2>
        <p className="text-slate-400 text-sm mt-1">Global threat distribution and regional impact.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Country Bar Chart */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Incidents by Country</h3>
          <div className="h-96">
            <Bar 
              data={countryBarData} 
              options={{ 
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: '#1E293B' }, ticks: { color: '#94A3B8' } },
                  x: { grid: { display: false }, ticks: { color: '#CBD5E1', font: { weight: 'bold' } } }
                }
              }} 
            />
          </div>
        </div>

        {/* Region Doughnut Chart */}
        <div className="bg-card p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Regional Distribution</h3>
          <div className="h-96 flex justify-center">
            <Doughnut 
              data={regionDoughnutData} 
              options={{ 
                responsive: true, maintainAspectRatio: false,
                plugins: { 
                  legend: { position: 'bottom', labels: { color: '#94A3B8' } } 
                },
                cutout: '65%'
              }} 
            />
          </div>
        </div>

        {/* Top Affected Country Card (Insight) */}
        <div className="lg:col-span-3 bg-gradient-to-r from-card to-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-red-500/10 rounded-full text-critical">
               <MapPin size={24} />
             </div>
             <div>
               <h4 className="text-white font-bold text-lg">Highest Threat Region</h4>
               <p className="text-slate-400 text-sm">The country with the most recorded incidents.</p>
             </div>
           </div>
           <div className="text-right">
             <p className="text-teal text-2xl font-black">{sortedCountries[0]}</p>
             <p className="text-slate-400 text-sm font-medium">{countryCounts[sortedCountries[0]]} Incidents</p>
           </div>
        </div>

      </div>
    </div>
  );
}