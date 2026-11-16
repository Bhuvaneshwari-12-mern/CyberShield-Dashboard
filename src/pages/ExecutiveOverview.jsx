import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler // <--- Added Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Shield, AlertTriangle, Activity, Globe } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement, BarElement,
  Filler // <--- Added Filler
);

export default function ExecutiveOverview() {
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

  // --- Process Data ---
  const totalIncidents = data.length;
  const criticalIncidents = data.filter(d => d.Severity === 'Critical').length;
  
  const severityCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  data.forEach(d => { if (severityCounts[d.Severity] !== undefined) severityCounts[d.Severity]++; });

  const monthlyCounts = {};
  data.forEach(d => {
    if(!d.Date) return;
    // The API returns a full ISO string, so we extract the month
    const date = new Date(d.Date);
    const month = date.toLocaleString('default', { month: 'short' });
    monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
  });
  
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const sortedMonths = Object.keys(monthlyCounts).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

  // --- Charts ---
  const doughnutData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: [severityCounts.Critical, severityCounts.High, severityCounts.Medium, severityCounts.Low],
      backgroundColor: ['#EF4444', '#F59E0B', '#FACC15', '#10B981'],
      borderColor: '#111827',
      borderWidth: 2,
      hoverOffset: 4
    }]
  };

  const lineData = {
    labels: sortedMonths,
    datasets: [{
      label: 'Incidents per Month',
      data: sortedMonths.map(m => monthlyCounts[m]),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden group hover:border-accent transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Incidents</p>
              <h3 className="text-3xl font-bold text-white">{totalIncidents.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg text-accent"><Shield size={20}/></div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden group hover:border-critical transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Critical Threats</p>
              <h3 className="text-3xl font-bold text-critical">{criticalIncidents.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg text-critical"><AlertTriangle size={20}/></div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden group hover:border-teal transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Resolved</p>
              <h3 className="text-3xl font-bold text-low">{data.filter(d => d.Status === 'Resolved').length}</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-low"><Activity size={20}/></div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden group hover:border-teal transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Countries Affected</p>
              <h3 className="text-3xl font-bold text-white">{new Set(data.map(d => d.Country)).size}</h3>
            </div>
            <div className="p-2 bg-cyan-500/10 rounded-lg text-teal"><Globe size={20}/></div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Incident Trend (2024)</h3>
          <div className="h-72">
            <Line 
              data={lineData} 
              options={{ 
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: '#1E293B' }, ticks: { color: '#94A3B8' } },
                  x: { grid: { display: false }, ticks: { color: '#94A3B8' } }
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
          <div className="h-72 flex justify-center">
            <Doughnut 
              data={doughnutData} 
              options={{ 
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8' } } },
                cutout: '70%'
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}