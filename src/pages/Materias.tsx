import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, BookOpen } from 'lucide-react';
import { Materia, Carrera } from '../types';

export default function Materias() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Materia>({
    nombre: '',
    codigo: '',
    creditos: 4,
    semestre: 1,
    descripcion: '',
    carrera_id: 0,
    estado: 'activa'
  });

  const fetchData = async () => {
    try {
      const [mRes, cRes] = await Promise.all([
        fetch('/api/materias'),
        fetch('/api/carreras')
      ]);
      setMaterias(await mRes.json());
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
      const res = await fetch('/api/materias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ nombre: '', codigo: '', creditos: 4, semestre: 1, descripcion: '', carrera_id: 0, estado: 'activa' });
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
    if (!confirm('¿Eliminar materia?')) return;
    await fetch(`/api/materias/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestión de Materias</h2>
          <p className="text-slate-500 mt-1">Administra el catálogo académico oficial.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} />
          <span>Nueva Materia</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Código</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Créditos</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Carrera</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {materias.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{m.nombre}</div>
                    <div className="text-xs text-slate-500">Semestre {m.semestre}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{m.codigo}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{m.creditos}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {m.carrera_nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => m.id && handleDelete(m.id)}
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nueva Materia</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
                  <input 
                    type="text" required
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Código</label>
                  <input 
                    type="text" required
                    value={formData.codigo}
                    onChange={e => setFormData({...formData, codigo: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Créditos</label>
                  <input 
                    type="number" required
                    value={formData.creditos}
                    onChange={e => setFormData({...formData, creditos: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Semestre</label>
                  <input 
                    type="number" required
                    value={formData.semestre}
                    onChange={e => setFormData({...formData, semestre: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Carrera</label>
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
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                  <textarea 
                    value={formData.descripcion}
                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Registrar</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-bold">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
