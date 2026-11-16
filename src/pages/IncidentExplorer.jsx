import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function IncidentExplorer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterCountry, setFilterCountry] = useState('All');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

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

  if (loading) return <div className="text-accent animate-pulse">Loading Incident Data...</div>;

  // Get unique countries for the dropdown
  const countries = ['All', ...new Set(data.map(d => d.Country))];

  // Filter Data
  const filteredData = data.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.AttackName?.toLowerCase().includes(searchLower) || 
      item.TargetSystem?.toLowerCase().includes(searchLower) ||
      item.AttackCategory?.toLowerCase().includes(searchLower) ||
      item.Country?.toLowerCase().includes(searchLower);
      
    const matchesSeverity = filterSeverity === 'All' || item.Severity === filterSeverity;
    const matchesCountry = filterCountry === 'All' || item.Country === filterCountry;
    
    return matchesSearch && matchesSeverity && matchesCountry;
  });

  // Pagination Calculation
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;

  const getSeverityColor = (severity) => {
    if (severity === 'Critical') return 'bg-critical/10 text-critical border-critical/20';
    if (severity === 'High') return 'bg-high/10 text-high border-high/20';
    if (severity === 'Medium') return 'bg-medium/10 text-medium border-medium/20';
    return 'bg-low/10 text-low border-low/20';
  };

  // --- EXPORT TO CSV FUNCTION ---
  const exportToCSV = () => {
    if (filteredData.length === 0) return;

    // 1. Get Headers
    const headers = ["IncidentID", "Date", "Country", "Region", "AttackCategory", "AttackName", "Severity", "TargetSystem", "Status"].join(',');
    
    // 2. Format Rows
    const csvRows = filteredData.map(row => {
      return [
        row.IncidentID,
        row.Date,
        `"${row.Country}"`,
        `"${row.Region}"`,
        `"${row.AttackCategory}"`,
        `"${row.AttackName}"`,
        `"${row.Severity}"`,
        `"${row.TargetSystem}"`,
        `"${row.Status}"`
      ].join(',');
    });
    
    // 3. Combine and Download
    const csvString = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CyberShield_Incidents.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Header & Filters */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Incident Explorer</h2>
          <p className="text-slate-400 text-sm mt-1">Search, filter, and analyze individual threat records.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search attacks or systems..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-card border border-slate-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
          
          {/* Severity Filter */}
          <select 
            value={filterSeverity} 
            onChange={(e) => { setFilterSeverity(e.target.value); setCurrentPage(1); }}
            className="bg-card border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent outline-none cursor-pointer"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Country Filter */}
          <select 
            value={filterCountry} 
            onChange={(e) => { setFilterCountry(e.target.value); setCurrentPage(1); }}
            className="bg-card border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent outline-none cursor-pointer"
          >
            {countries.map(c => <option key={c} value={c}>{c === 'All' ? 'All Countries' : c}</option>)}
          </select>

          {/* Export CSV Button */}
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-accent/20"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-slate-800 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/50 text-xs uppercase text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Incident ID</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Attack Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Target System</th>
                <th className="px-6 py-4 font-semibold">Country</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                    No incidents found matching your filters.
                  </td>
                </tr>
              ) : (
                currentRows.map((row) => (
                  <tr key={row.IncidentID} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">#{row.IncidentID}</td>
                    <td className="px-6 py-4">{new Date(row.Date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-white font-medium">{row.AttackName}</td>
                    <td className="px-6 py-4">{row.AttackCategory}</td>
                    <td className="px-6 py-4">{row.TargetSystem}</td>
                    <td className="px-6 py-4">{row.Country}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getSeverityColor(row.Severity)}`}>
                        {row.Severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 ${row.Status === 'Resolved' ? 'text-low' : row.Status === 'Investigating' ? 'text-medium' : 'text-critical'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.Status === 'Resolved' ? 'bg-low' : row.Status === 'Investigating' ? 'bg-medium' : 'bg-critical'}`}></span>
                        {row.Status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/20">
          <span className="text-sm text-slate-500">
            Showing <span className="text-white font-medium">{filteredData.length > 0 ? indexOfFirstRow + 1 : 0}</span> to <span className="text-white font-medium">{Math.min(indexOfLastRow, filteredData.length)}</span> of <span className="text-white font-medium">{filteredData.length}</span> records
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-slate-400 px-2">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 hover:bg-slate-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}