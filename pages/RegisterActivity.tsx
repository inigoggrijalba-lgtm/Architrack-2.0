import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Input, Select } from '../components/ui';
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const RegisterActivity: React.FC = () => {
  const { projects, addLog } = useData();
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handlePreSubmit = () => {
    if (!projectId || !date || !hours) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    await addLog({
        project_id: projectId,
        date: date,
        hours: Number(hours),
        description: notes || ''
    });

    setShowConfirmModal(false);
    setSuccess(true);
    setHours('');
    setNotes('');
    setTimeout(() => setSuccess(false), 3000);
  };

  // Find project name for the confirmation modal
  const selectedProjectName = projects.find(p => p.id === projectId)?.name || 'Desconocido';

  // Filter out archived projects
  const activeProjects = projects.filter(p => !p.is_archived);

  return (
    <div className="space-y-6 relative">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white mb-1">Registrar Actividad</h2>
        <p className="text-slate-400 text-sm">
           {useData().loading ? 'Cargando datos...' : 'Sincronizado con Supabase'}
        </p>
      </div>

      <Card className="space-y-6 pt-6">
        <Select 
            label="Proyecto" 
            value={projectId} 
            onChange={(e) => setProjectId(e.target.value)}
        >
            <option value="" disabled>Seleccionar proyecto...</option>
            {activeProjects.map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
            <Input 
                type="date" 
                label="Fecha" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                icon={<Calendar size={18} />}
            />
            <Input 
                type="number" 
                label="Nº de Horas" 
                placeholder="0" 
                min="0"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                icon={<Clock size={18} />}
            />
        </div>

        <div className="space-y-2">
            <label className="text-slate-200 font-medium text-sm">Notas (Opcional)</label>
            <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                    <FileText size={18} />
                </div>
                <textarea 
                    className="w-full bg-slate-800 text-white rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none py-3 pl-10 pr-4 h-24 resize-none placeholder:text-slate-500"
                    placeholder="Detalles de la tarea..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
        </div>

        <Button onClick={handlePreSubmit} disabled={!projectId || !hours}>
           {success ? <span className="flex items-center gap-2"><CheckCircle2/> Guardado</span> : 'Guardar Registro'}
        </Button>
      </Card>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-sm bg-slate-900 border-2 border-slate-700 shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-4 p-2">
                    <div className="w-12 h-12 rounded-full bg-orange-900/30 flex items-center justify-center text-orange-500">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">¿Guardar Registro?</h3>
                        <div className="text-slate-400 text-sm mt-3 space-y-1 text-left bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                            <p><strong className="text-slate-300">Proyecto:</strong> {selectedProjectName}</p>
                            <p><strong className="text-slate-300">Fecha:</strong> {date}</p>
                            <p><strong className="text-slate-300">Horas:</strong> {hours} h</p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full mt-4">
                        <Button variant="ghost" onClick={() => setShowConfirmModal(false)} className="w-full">
                            Cancelar
                        </Button>
                        <button 
                            onClick={handleConfirmSubmit}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium py-3 px-4 shadow-lg shadow-orange-900/20 transition-colors"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};