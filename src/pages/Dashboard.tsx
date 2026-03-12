import React, { useEffect, useState } from 'react';
import { GraduationCap, Users, BookOpen, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { DashboardStats } from '../types';

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: number, icon: any, color: string, trend?: string }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value.toLocaleString()}</h3>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEstudiantes: 0,
    totalCarreras: 0,
    totalMaterias: 0
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Resumen Corporativo</h2>
        <p className="text-slate-500 mt-1">Bienvenido al panel de gestión académica de UniwebPro.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total de Estudiantes" 
          value={stats.totalEstudiantes} 
          icon={Users} 
          color="bg-blue-600" 
          trend="+5.2%" 
        />
        <StatCard 
          title="Carreras Activas" 
          value={stats.totalCarreras} 
          icon={GraduationCap} 
          color="bg-indigo-600" 
          trend="Estable" 
        />
        <StatCard 
          title="Materias Registradas" 
          value={stats.totalMaterias} 
          icon={BookOpen} 
          color="bg-emerald-600" 
          trend="+12.4%" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Rendimiento Académico Mensual</h3>
            <button className="text-blue-600 text-sm font-semibold hover:underline">Ver detalles</button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[
                { label: 'Ingeniería de Software', value: 92 },
                { label: 'Administración de Empresas', value: 78 },
                { label: 'Arquitectura', value: 85 }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 h-48 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <TrendingUp size={32} className="text-slate-400 mx-auto" />
                <p className="text-slate-400 text-sm mt-2">Gráfico de tendencias académicas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">Actividades Recientes</h3>
          </div>
          <div className="p-6 flex flex-col gap-6">
            {[
              { title: 'Nueva inscripción', desc: 'Juan Pérez se unió a Ing. de Sistemas', time: 'Hace 15 min', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
              { title: 'Materia actualizada', desc: 'Cálculo Diferencial - Plan 2024', time: 'Hace 2 horas', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100' },
              { title: 'Carrera habilitada', desc: 'Diseño Digital y UX', time: 'Ayer', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-100' }
            ].map((act, i) => (
              <div key={i} className="flex gap-4">
                <div className={`size-10 rounded-full ${act.bg} ${act.color} flex items-center justify-center shrink-0`}>
                  <act.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{act.title}</p>
                  <p className="text-xs text-slate-500">{act.desc}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-auto p-4 text-center text-sm font-semibold text-slate-500 border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Ver todo el historial
          </button>
        </div>
      </div>
    </div>
  );
}
