import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Settings, 
  Bell, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Carreras from './pages/Carreras';
import Materias from './pages/Materias';
import Estudiantes from './pages/Estudiantes';

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">UniwebPro</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <SidebarItem to="/" icon={LayoutDashboard} label="Tablero" active={location.pathname === '/'} />
          <SidebarItem to="/carreras" icon={GraduationCap} label="Carreras" active={location.pathname === '/carreras'} />
          <SidebarItem to="/materias" icon={BookOpen} label="Materias" active={location.pathname === '/materias'} />
          <SidebarItem to="/estudiantes" icon={Users} label="Estudiantes" active={location.pathname === '/estudiantes'} />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <SidebarItem to="/config" icon={Settings} label="Configuración" active={location.pathname === '/config'} />
          <div className="flex items-center gap-3 px-4 py-4 mt-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <LayoutDashboard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <HelpCircle size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/carreras" element={<Carreras />} />
          <Route path="/materias" element={<Materias />} />
          <Route path="/estudiantes" element={<Estudiantes />} />
        </Routes>
      </Layout>
    </Router>
  );
}
