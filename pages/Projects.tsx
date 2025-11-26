import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Input, Badge } from '../components/ui';
import { Pencil, Trash2, Plus, X, AlertTriangle, Check, Archive, RefreshCcw } from 'lucide-react';
import { Project } from '../types';
import { clsx } from 'clsx';

export const Projects: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Modals State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setNewName(project.name);
    setNewCode(project.code);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setNewName('');
    setNewCode('');
  };

  const handleSave = async () => {
    if(!newName || !newCode) return;

    if (editingId) {
        // Find existing to preserve other fields like is_archived
        const existing = projects.find(p => p.id === editingId);
        if (existing) {
            await updateProject({
                ...existing,
                name: newName,
                code: newCode
            });
        }
    } else {
        await addProject({
            name: newName,
            code: newCode
        });
    }
    handleCloseModal();
  };

  const confirmDelete = async () => {
    if (deleteId) {
        await deleteProject(deleteId);
        setDeleteId(null);
    }
  };

  const toggleArchive = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
        await updateProject({
            ...project,
            is_archived: !project.is_archived
        });
    }
    setArchiveId(null);
  };

  // Sort projects: Active first, Archived last
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
        // First sort by archived status (false comes first)
        if (a.is_archived !== b.is_archived) {
            return a.is_archived ? 1 : -1;
        }
        // Then sort by name
        return a.name.localeCompare(b.name); 
    });
  }, [projects]);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center mb-2">
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">Proyectos</h2>
            <p className="text-slate-400 text-sm">Gestión de proyectos</p>
        </div>
        <button 
            onClick={() => {
                handleCloseModal(); // Reset form if was editing
                setShowAddModal(!showAddModal);
            }}
            className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-900/40 active:scale-95 transition-transform"
        >
            {showAddModal ? <X size={20} /> : <Plus size={24} />}
        </button>
      </div>

      {/* Add/Edit Project Form */}
      {showAddModal && (
          <div className="animate-in slide-in-from-top-4 duration-300">
            <Card className="space-y-4 border-orange-500/30 bg-slate-800/50">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-white">{editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
                    <button onClick={handleCloseModal} className="text-slate-400"><X size={16} /></button>
                </div>
                <div className="flex gap-3">
                    <div className="w-1/3">
                        <Input 
                            placeholder="# CÓD" 
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value)}
                        />
                    </div>
                    <div className="w-2/3">
                        <Input 
                            placeholder="Nombre del proyecto..." 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                </div>
                <Button onClick={handleSave}>
                    {editingId ? 'Actualizar Proyecto' : 'Guardar Proyecto'}
                </Button>
            </Card>
          </div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {sortedProjects.map((project) => (
            <Card 
                key={project.id} 
                className={clsx(
                    "flex justify-between items-center group transition-colors",
                    project.is_archived 
                        ? "border-green-900/30 bg-slate-900/40 opacity-75 hover:opacity-100" 
                        : "hover:border-slate-600"
                )}
            >
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={clsx("font-bold text-lg", project.is_archived ? "text-slate-400 line-through" : "text-white")}>
                            {project.name}
                        </h3>
                        {project.is_archived && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-900/20 px-2 py-0.5 rounded border border-green-900/30">
                                Archivado
                            </span>
                        )}
                    </div>
                    <Badge color={project.is_archived ? "text-slate-500" : "text-orange-500"}>{project.code}</Badge>
                </div>
                <div className="flex gap-1">
                    <button 
                        onClick={() => project.is_archived ? toggleArchive(project.id) : setArchiveId(project.id)}
                        className={clsx(
                            "p-2 rounded-xl transition-colors",
                            project.is_archived 
                                ? "text-slate-500 hover:text-green-400 hover:bg-green-900/20" 
                                : "text-slate-500 hover:text-green-500 hover:bg-green-900/20"
                        )}
                        title={project.is_archived ? "Desarchivar" : "Archivar"}
                    >
                        {project.is_archived ? <RefreshCcw size={18} /> : <Check size={18} />}
                    </button>
                    
                    <Button variant="ghost" className="hover:text-blue-400" onClick={() => handleEdit(project)}>
                        <Pencil size={18} />
                    </Button>
                    <Button variant="danger" onClick={() => setDeleteId(project.id)}>
                        <Trash2 size={18} />
                    </Button>
                </div>
            </Card>
        ))}
        
        {projects.length === 0 && (
            <div className="text-center py-10 text-slate-500">
                No hay proyectos registrados.
            </div>
        )}
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-sm bg-slate-900 border-2 border-red-900/50 shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-4 p-2">
                    <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">¿Eliminar Proyecto?</h3>
                        <p className="text-slate-400 text-sm mt-2">
                            Esta acción es irreversible. Se eliminará el proyecto y todos sus registros asociados.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full mt-4">
                        <Button variant="ghost" onClick={() => setDeleteId(null)} className="w-full">
                            Cancelar
                        </Button>
                        <button 
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

      {/* Archive Confirmation Modal Overlay */}
      {archiveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-sm bg-slate-900 border-2 border-green-900/50 shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-4 p-2">
                    <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center text-green-500">
                        <Archive size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">¿Desea Archivar Proyecto?</h3>
                        <p className="text-slate-400 text-sm mt-2">
                            El proyecto se moverá al final de la lista y no aparecerá en el registro de horas.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full mt-4">
                        <Button variant="ghost" onClick={() => setArchiveId(null)} className="w-full">
                            Cancelar
                        </Button>
                        <button 
                            onClick={() => toggleArchive(archiveId)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium py-3 px-4 shadow-lg shadow-green-900/20 transition-colors"
                        >
                            Archivar
                        </button>
                    </div>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};