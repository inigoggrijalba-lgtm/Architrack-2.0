import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Project, WorkLog } from '../types';
import { supabase } from '../services/supabase';

interface DataContextType {
  projects: Project[];
  logs: WorkLog[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'is_archived'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addLog: (log: Omit<WorkLog, 'id'>) => Promise<void>;
  updateLog: (log: WorkLog) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize data
  const refreshData = useCallback(async () => {
    setLoading(true);
    
    if (supabase) {
      // Supabase Mode
      const { data: pData } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
      const { data: lData } = await supabase.from('work_logs').select('*').order('date', { ascending: false });
      
      if (pData) {
        // Ensure is_archived is treated as boolean even if DB returns null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sanitizedProjects: Project[] = pData.map((p: any) => ({
            ...p,
            is_archived: !!p.is_archived 
        }));
        setProjects(sanitizedProjects);
      }
      if (lData) setLogs(lData);
    } else {
      // LocalStorage Fallback (Mock Mode)
      const localProjects = localStorage.getItem('architrack_projects');
      const localLogs = localStorage.getItem('architrack_logs');
      
      if (localProjects) {
        setProjects(JSON.parse(localProjects));
      } else {
        // Default seed data if empty
        const seedProjects: Project[] = [
            { id: '1', name: 'Milagro', code: '1', is_archived: false },
            { id: '2', name: 'Abejeras', code: '25009ABE', is_archived: false },
            { id: '3', name: 'Ansoain', code: '25047CAN', is_archived: false },
        ];
        setProjects(seedProjects);
        localStorage.setItem('architrack_projects', JSON.stringify(seedProjects));
      }

      if (localLogs) {
        setLogs(JSON.parse(localLogs));
      } else {
        // Seed logs
        const seedLogs: WorkLog[] = [
             { id: '101', project_id: '3', date: '2025-11-06', hours: 4, description: 'Visita a Obra' },
             { id: '102', project_id: '3', date: '2025-10-10', hours: 8, description: 'Estado Actual' },
             { id: '103', project_id: '3', date: '2025-10-11', hours: 5, description: 'Planos' },
             { id: '104', project_id: '1', date: '2025-11-01', hours: 6, description: 'Reunión' },
             { id: '105', project_id: '2', date: '2025-11-02', hours: 6, description: 'Estructuras' },
        ];
        setLogs(seedLogs);
        localStorage.setItem('architrack_logs', JSON.stringify(seedLogs));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addProject = async (projectData: Omit<Project, 'id' | 'is_archived'>) => {
    if (supabase) {
      await supabase.from('projects').insert([{ ...projectData, is_archived: false }]);
    } else {
      const newProject: Project = { ...projectData, id: crypto.randomUUID(), is_archived: false };
      const updated = [...projects, newProject];
      setProjects(updated);
      localStorage.setItem('architrack_projects', JSON.stringify(updated));
    }
    await refreshData();
  };

  const updateProject = async (project: Project) => {
    if (supabase) {
      const { id, ...updates } = project;
      await supabase.from('projects').update(updates).eq('id', id);
    } else {
      const updated = projects.map(p => p.id === project.id ? project : p);
      setProjects(updated);
      localStorage.setItem('architrack_projects', JSON.stringify(updated));
    }
    await refreshData();
  };

  const deleteProject = async (id: string) => {
    if (supabase) {
      await supabase.from('projects').delete().eq('id', id);
    } else {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('architrack_projects', JSON.stringify(updated));
    }
    await refreshData();
  };

  const addLog = async (logData: Omit<WorkLog, 'id'>) => {
    if (supabase) {
      await supabase.from('work_logs').insert([logData]);
    } else {
      const newLog: WorkLog = { ...logData, id: crypto.randomUUID() };
      const updated = [...logs, newLog];
      setLogs(updated);
      localStorage.setItem('architrack_logs', JSON.stringify(updated));
    }
    await refreshData();
  };

  const updateLog = async (log: WorkLog) => {
    if (supabase) {
      const { id, ...updates } = log;
      await supabase.from('work_logs').update(updates).eq('id', id);
    } else {
      const updated = logs.map(l => l.id === log.id ? log : l);
      setLogs(updated);
      localStorage.setItem('architrack_logs', JSON.stringify(updated));
    }
    await refreshData();
  };

  const deleteLog = async (id: string) => {
    try {
      if (supabase) {
        const { error } = await supabase.from('work_logs').delete().eq('id', id);
        if (error) {
          console.error("Error deleting log from Supabase:", error);
          throw error;
        }
      } else {
        const updated = logs.filter(l => l.id !== id);
        setLogs(updated);
        localStorage.setItem('architrack_logs', JSON.stringify(updated));
      }
      await refreshData();
    } catch (err) {
      console.error("Failed to delete log:", err);
      // Opcional: Podríamos añadir un estado de error global aquí si fuera necesario
    }
  };

  return (
    <DataContext.Provider value={{ projects, logs, loading, addProject, updateProject, deleteProject, addLog, updateLog, deleteLog, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};