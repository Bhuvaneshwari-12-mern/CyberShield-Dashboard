import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, Globe, TrendingUp, Search, Settings } from 'lucide-react';

export default function Layout() {
  const navItems = [
    { name: 'Executive Overview', path: '/', icon: LayoutDashboard },
    { name: 'Attack Intelligence', path: '/attacks', icon: ShieldAlert },
    { name: 'Geographical Analysis', path: '/geo', icon: Globe },
    { name: 'Trend & Risk', path: '/trends', icon: TrendingUp },
    { name: 'Incident Explorer', path: '/explorer', icon: Search },
  ];

  return (
    <div className="flex h-screen bg-midnight font-sans text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-slate-800 flex flex-col shadow-xl z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <ShieldAlert className="text-accent mr-2" />
          <span className="text-white font-bold text-lg tracking-wide">CyberShield</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.name}
                to={item.path} 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-accent text-white shadow-md shadow-accent/20' 
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`
                }
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-accent font-bold border border-slate-700">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-white">Analyst</p>
              <p className="text-xs text-slate-500">Security Team</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="h-16 bg-card border-b border-slate-800 flex items-center justify-between px-8 shadow-sm z-0">
          <h1 className="text-xl font-semibold text-white">Security Analytics Dashboard</h1>
          <div className="flex items-center gap-4 text-sm text-slate-400">
             <span className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-low animate-pulse"></span>
               Live Data Connected
             </span>
          </div>
        </header>
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}