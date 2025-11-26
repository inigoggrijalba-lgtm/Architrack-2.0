import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Card, Select, Input, Button } from '../components/ui';
import { Filter, Clock, CalendarDays, Pencil, Trash2, X, Save, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { APP_COLORS } from '../constants';
import { WorkLog } from '../types';

export const Reports: React.FC = () => {
  const { projects, logs, updateLog, deleteLog } = useData();
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Edit State
  const [editingLog, setEditingLog] = useState<WorkLog | null>(null);
  const [editForm, setEditForm] = useState<Partial<WorkLog>>({});
  
  // Delete Confirmation State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
        const matchesProject = selectedProject === 'all' || log.project_id === selectedProject;
        const logDate = new Date(log.date);
        const start = fromDate ? new Date(fromDate) : new Date('2000-01-01');
        const end = toDate ? new Date(toDate) : new Date();
        // Adjust end date to include the full day
        end.setHours(23, 59, 59, 999);
        
        const matchesDate = logDate >= start && logDate <= end;
        return matchesProject && matchesDate;
    });
  }, [logs, selectedProject, fromDate, toDate]);

  // Stats
  const totalHours = useMemo(() => filteredLogs.reduce((acc, curr) => acc + curr.hours, 0), [filteredLogs]);
  const totalRecords = filteredLogs.length;

  // Chart Data Preparation
  const chartData = useMemo(() => {
    const projectHours: Record<string, number> = {};
    
    filteredLogs.forEach(log => {
        const proj = projects.find(p => p.id === log.project_id);
        const name = proj ? proj.name : 'Unknown';
        projectHours[name] = (projectHours[name] || 0) + log.hours;
    });

    return Object.keys(projectHours).map(name => ({
        name,
        hours: projectHours[name]
    }));
  }, [filteredLogs, projects]);

  const handleEditClick = (log: WorkLog) => {
    setEditingLog(log);
    setEditForm({ ...log });
    setShowDeleteConfirm(false); // Reset delete state just in case
  };

  const handleUpdate = async () => {
    if (editingLog && editForm.project_id && editForm.date && editForm.hours) {
        await updateLog({
            ...editingLog,
            project_id: editForm.project_id,
            date: editForm.date,
            hours: Number(editForm.hours),
            description: editForm.description || ''
        });
        setEditingLog(null);
    }
  };

  const handleDeleteClick = () => {
    // Instead of window.confirm, show the custom modal
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (editingLog) {
        await deleteLog(editingLog.id);
        setShowDeleteConfirm(false);
        setEditingLog(null);
    }
  };

  return (
    <div className="space-y-6 relative">
       <div className="mb-2">
        <h2 className="text-2xl font-bold text-white mb-1">Reportes</h2>
        <p className="text-slate-400 text-sm">Analiza el rendimiento por proyecto</p>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-orange-500 font-medium mb-2">
            <Filter size={20} />
            <h3>Filtros</h3>
        </div>
        
        <Select 
            label="PROYECTO" 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
        >
            <option value="all">Todos los proyectos</option>
            {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
            ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
            <Input 
                type="date" 
                label="DESDE"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
            />
            <Input 
                type="date" 
                label="HASTA"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
            />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-600 rounded-xl p-4 shadow-lg shadow-orange-900/20 text-white">
            <div className="flex items-center gap-2 mb-2 opacity-90">
                <Clock size={16} />
                <span className="text-xs font-bold uppercase">Total Horas</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{totalHours}</span>
                <span className="text-sm opacity-80">h</span>
            </div>
        </div>
        <Card>
            <div className="flex items-center gap-2 mb-2 text-slate-400">
                <CalendarDays size={16} />
                <span className="text-xs font-bold uppercase">Registros</span>
            </div>
             <span className="text-3xl font-bold text-white">{totalRecords}</span>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-bold text-white mb-6">Horas por Proyecto</h3>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        axisLine={false} 
                        tickLine={false}
                        interval={0}
                    />
                    <YAxis 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        axisLine={false} 
                        tickLine={false}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: '#1e293b' }}
                    />
                    <Bar dataKey="hours" name="Horas" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={APP_COLORS.chartColors[index % APP_COLORS.chartColors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </Card>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">Detalle de Registros</h3>
        <div className="space-y-3">
            {filteredLogs.map((log) => {
                const project = projects.find(p => p.id === log.project_id);
                const dateObj = new Date(log.date);
                const day = dateObj.getDate();
                const month = dateObj.toLocaleString('es-ES', { month: 'short' });

                return (
                    <Card key={log.id} className="flex justify-between items-center py-3 group relative overflow-hidden active:scale-[0.99] transition-transform">
                        <div className="flex-1" onClick={() => handleEditClick(log)}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-orange-500 font-bold text-sm">[{project?.code}]</span>
                                <span className="font-semibold text-white text-sm">{project?.name}</span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2">
                                <span>{day} {month}</span>
                                {log.description && (
                                    <>
                                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                        <span className="line-clamp-1">{log.description}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-800 rounded-lg px-3 py-1.5 font-bold text-slate-200 text-sm border border-slate-700">
                                {log.hours} h
                            </div>
                            <button 
                                onClick={() => handleEditClick(log)}
                                className="text-slate-500 hover:text-orange-500 p-2 -mr-2 transition-colors"
                            >
                                <Pencil size={18} />
                            </button>
                        </div>
                    </Card>
                );
            })}
             {filteredLogs.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm">No se encontraron registros.</div>
            )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingLog && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
             {/* Backdrop */}
             <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
                onClick={() => setEditingLog(null)}
             />

             {/* Modal Content */}
             <div className="relative w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 shadow-2xl shadow-black/50 rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 fade-in duration-300">
                
                {/* Mobile Handle */}
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-700/50 mb-6 sm:hidden" />

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            Editar Registro
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">Modifica los detalles o elimina la actividad</p>
                    </div>
                    <button 
                        onClick={() => setEditingLog(null)} 
                        className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full p-2 transition-colors -mr-2 -mt-2"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-5">
                    <Select 
                        label="Proyecto" 
                        value={editForm.project_id} 
                        onChange={(e) => setEditForm({...editForm, project_id: e.target.value})}
                        className="bg-slate-800/50 focus:bg-slate-800"
                    >
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                        ))}
                    </Select>

                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            type="date" 
                            label="Fecha" 
                            value={editForm.date}
                            onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                            className="bg-slate-800/50 focus:bg-slate-800"
                        />
                        <Input 
                            type="number" 
                            label="Horas" 
                            step="0.5"
                            value={editForm.hours}
                            onChange={(e) => setEditForm({...editForm, hours: Number(e.target.value)})}
                            className="bg-slate-800/50 focus:bg-slate-800"
                        />
                    </div>

                    <div>
                        <label className="text-slate-200 font-medium text-sm mb-2 block">Descripción</label>
                        <textarea 
                             className="w-full bg-slate-800/50 focus:bg-slate-800 text-white rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none py-3 px-4 h-24 resize-none placeholder:text-slate-500 transition-colors"
                             value={editForm.description}
                             onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                             placeholder="Añade una descripción..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-800/50 mt-4">
                        <Button 
                            type="button"
                            variant="danger" 
                            className="w-auto px-4 flex items-center gap-2 justify-center bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all" 
                            onClick={handleDeleteClick}
                        >
                            <Trash2 size={18} />
                        </Button>
                        <Button className="flex-1 flex items-center gap-2 justify-center shadow-lg shadow-orange-500/20" onClick={handleUpdate}>
                            <Save size={18} />
                            Guardar Cambios
                        </Button>
                    </div>
                </div>
             </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL OVERLAY (Higher Z-Index) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-sm bg-slate-900 border-2 border-red-900/50 shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-4 p-2">
                    <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">¿Eliminar Registro?</h3>
                        <p className="text-slate-400 text-sm mt-2">
                            Esta acción es irreversible y eliminará las horas registradas.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full mt-4">
                        <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="w-full">
                            Cancelar
                        </Button>
                        <button 
                            type="button"
                            onClick={confirmDelete}
                            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium py-3 px-4 shadow-lg shadow-red-900/20 transition-colors"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};