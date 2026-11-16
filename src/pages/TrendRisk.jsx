import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, Calendar, AlertTriangle } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

export default function TrendRisk() {
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

  if (loading) return <div className="text-accent animate-pulse p-8">Loading Trends...</div>;

  // 1. Process Data for Weekday Frequency
  const weekdayCounts = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };
  const monthCounts = {};

  data.forEach(d => {
    if (!d.Date) return;
    const date = new Date(d.Date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    weekdayCounts[dayName] += 1;

    const monthName = date.toLocaleString('default', { month: 'short' });
    if (!monthCounts[monthName]) monthCounts[monthName] = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    if (monthCounts[monthName][d.Severity] !== undefined) {
      monthCounts[monthName][d.Severity] += 1;
    }
  });

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const sortedMonths = Object.keys(monthCounts).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

  // 2. Process Data for Severity Trend over Months
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const severityColors = { Critical: '#EF4444', High: '#F59E0B', Medium: '#FACC15', Low: '#10B981' };

  const stackedLineDatasets = severities.map(severity => ({
    label: severity,
    data: sortedMonths.map(m => monthCounts[m][severity]),
    borderColor: severityColors[severity],
    backgroundColor: severityColors[severity],
    tension: 0.4,
    fill: true,
  }));

  // Chart Configurations
  const weekdayBarData = {
    labels: weekdays,
    datasets: [{
      label: 'Attacks by Day',
      data: weekdays.map(day => weekdayCounts[day]),
      backgroundColor: '#8B5CF6', // Purple
      borderRadius: 6,
    }]
  };

  const severityTrendData = {
    labels: sortedMonths,
    datasets: stackedLineDatasets,
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-accent" /> Trend & Risk Analysis
        </h2>
        <p className="text-slate-400 text-sm mt-1">Analyze how attack patterns change over time and identify high-risk days.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekday Bar Chart */}
        <div className="bg-card p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-purple-400"/> Attack Frequency by Weekday
          </h3>
          <div className="h-80">
            <Bar 
              data={weekdayBarData} 
              options={{ 
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: '#1E293B' }, ticks: { color: '#94A3B8' } },
                  x: { grid: { display: false }, ticks: { color: '#CBD5E1' } }
                }
              }} 
            />
          </div>
        </div>

        {/* Severity Trend Line Chart */}
        <div className="bg-card p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-critical"/> Severity Trends over Time
          </h3>
          <div className="h-80">
            <Line 
              data={severityTrendData} 
              options={{ 
                responsive: true, maintainAspectRatio: false,
                plugins: { 
                  legend: { position: 'bottom', labels: { color: '#94A3B8', boxWidth: 12 } } 
                },
                scales: {
                  y: { stacked: true, grid: { color: '#1E293B' }, ticks: { color: '#94A3B8' } },
                  x: { grid: { display: false }, ticks: { color: '#94A3B8' } }
                }
              }} 
            />
          </div>
        </div>

        {/* Risk Insight Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-card p-6 rounded-xl border border-slate-700 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-accent/10 rounded-full text-accent">
               <TrendingUp size={24} />
             </div>
             <div>
               <h4 className="text-white font-bold text-lg">Highest Risk Day</h4>
               <p className="text-slate-400 text-sm">The day of the week with the highest volume of cyber attacks.</p>
             </div>
           </div>
           <div className="text-right">
             {/* Calculate the day with the max count */}
             <p className="text-accent text-2xl font-black">
               {weekdays.reduce((a, b) => weekdayCounts[a] > weekdayCounts[b] ? a : b)}
             </p>
             <p className="text-slate-400 text-sm font-medium">
               {Math.max(...Object.values(weekdayCounts))} Incidents
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}
