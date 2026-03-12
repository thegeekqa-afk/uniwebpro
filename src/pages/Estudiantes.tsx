import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, UserPlus, BadgeCheck, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { Estudiante, Carrera } from '../types';

export default function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Estudiante>({
    nombres: '',
    apellidos: '',
    tipo_documento: 'DNI',
    numero_documento: '',
    correo: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: '',
    carrera_id: 0,
    estado: 'activo'
  });

  const fetchData = async () => {
    try {
      const [eRes, cRes] = await Promise.all([
        fetch('/api/estudiantes'),
        fetch('/api/carreras')
      ]);
      setEstudiantes(await eRes.json());
      setCarreras(await cRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ nombres: '', apellidos: '', tipo_documento: 'DNI', numero_documento: '', correo: '', telefono: '', fecha_nacimiento: '', direccion: '', carrera_id: 0, estado: 'activo' });
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al guardar');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar estudiante?')) return;
    await fetch(`/api/estudiantes/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Registro de Estudiantes</h2>
          <p className="text-slate-500 mt-1">Gestione las admisiones y datos personales.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20"
        >
          <UserPlus size={20} />
          <span>Registrar Estudiante</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o documento..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Estudiante</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Documento</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Carrera</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Contacto</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {estudiantes.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{e.nombres} {e.apellidos}</div>
                    <div className="text-xs text-slate-500">{e.correo}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">
                    {e.tipo_documento}: {e.numero_documento}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {e.carrera_nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {e.telefono}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => e.id && handleDelete(e.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registro de Estudiante</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><BadgeCheck size={16} /> Nombres</label>
                  <input 
                    type="text" required
                    value={formData.nombres}
                    onChange={e => setFormData({...formData, nombres: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Juan Pablo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><BadgeCheck size={16} /> Apellidos</label>
                  <input 
                    type="text" required
                    value={formData.apellidos}
                    onChange={e => setFormData({...formData, apellidos: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Pérez García"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">Tipo de Documento</label>
                  <select 
                    value={formData.tipo_documento}
                    onChange={e => setFormData({...formData, tipo_documento: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option>DNI</option>
                    <option>Pasaporte</option>
                    <option>Carnet de Extranjería</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">Número de Documento</label>
                  <input 
                    type="text" required
                    value={formData.numero_documento}
                    onChange={e => setFormData({...formData, numero_documento: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><Mail size={16} /> Correo Electrónico</label>
                  <input 
                    type="email" required
                    value={formData.correo}
                    onChange={e => setFormData({...formData, correo: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><Phone size={16} /> Teléfono</label>
                  <input 
                    type="tel"
                    value={formData.telefono}
                    onChange={e => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><Calendar size={16} /> Fecha de Nacimiento</label>
                  <input 
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">Carrera</label>
                  <select 
                    required
                    value={formData.carrera_id}
                    onChange={e => setFormData({...formData, carrera_id: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione carrera</option>
                    {carreras.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><MapPin size={16} /> Dirección Residencial</label>
                  <textarea 
                    value={formData.direccion}
                    onChange={e => setFormData({...formData, direccion: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20">Registrar Estudiante</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-bold">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
