import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { Carrera } from '../types';

export default function Carreras() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarrera, setEditingCarrera] = useState<Carrera | null>(null);
  const [formData, setFormData] = useState<Carrera>({
    nombre: '',
    codigo: '',
    facultad: '',
    descripcion: '',
    duracion_semestres: 10,
    estado: 'activa'
  });

  const fetchCarreras = () => {
    fetch('/api/carreras')
      .then(res => res.json())
      .then(data => setCarreras(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCarreras();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCarrera ? `/api/carreras/${editingCarrera.id}` : '/api/carreras';
    const method = editingCarrera ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingCarrera(null);
        setFormData({ nombre: '', codigo: '', facultad: '', descripcion: '', duracion_semestres: 10, estado: 'activa' });
        fetchCarreras();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al guardar');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta carrera?')) return;
    try {
      await fetch(`/api/carreras/${id}`, { method: 'DELETE' });
      fetchCarreras();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (carrera?: Carrera) => {
    if (carrera) {
      setEditingCarrera(carrera);
      setFormData(carrera);
    } else {
      setEditingCarrera(null);
      setFormData({ nombre: '', codigo: '', facultad: '', descripcion: '', duracion_semestres: 10, estado: 'activa' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestión de Carreras</h2>
          <p className="text-slate-500 mt-1">Administre el catálogo académico y facultades.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} />
          <span>Agregar Carrera</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar carreras..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Código</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Facultad</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Estado</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {carreras.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{c.nombre}</div>
                    <div className="text-xs text-slate-500">{c.duracion_semestres} semestres</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{c.codigo}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{c.facultad}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      c.estado === 'activa' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openModal(c)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => c.id && handleDelete(c.id)}
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingCarrera ? 'Editar Carrera' : 'Nueva Carrera'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre de la Carrera</label>
                  <input 
                    type="text" 
                    required
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Ingeniería de Sistemas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Código</label>
                  <input 
                    type="text" 
                    required
                    value={formData.codigo}
                    onChange={e => setFormData({...formData, codigo: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="IS101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Duración (Semestres)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.duracion_semestres}
                    onChange={e => setFormData({...formData, duracion_semestres: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Facultad</label>
                  <input 
                    type="text" 
                    required
                    value={formData.facultad}
                    onChange={e => setFormData({...formData, facultad: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Facultad de Ingeniería"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                  <textarea 
                    value={formData.descripcion}
                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                  <select 
                    value={formData.estado}
                    onChange={e => setFormData({...formData, estado: e.target.value as any})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                >
                  {editingCarrera ? 'Actualizar' : 'Registrar'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
