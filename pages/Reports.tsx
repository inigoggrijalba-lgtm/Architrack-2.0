import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Card, Select, Input } from '../components/ui';
import { Filter, Clock, CalendarDays } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { APP_COLORS } from '../constants';

export const Reports: React.FC = () => {
  const { projects, logs } = useData();
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]);

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

  return (
    <div className="space-y-6">
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
                    <Card key={log.id} className="flex justify-between items-center py-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-orange-500 font-bold text-sm">[{project?.code}]</span>
                                <span className="font-semibold text-white text-sm">{project?.name}</span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2">
                                <span>{day} {month}</span>
                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                <span>{log.description}</span>
                            </div>
                        </div>
                        <div className="bg-slate-800 rounded-lg px-3 py-1.5 font-bold text-slate-200 text-sm border border-slate-700">
                            {log.hours} h
                        </div>
                    </Card>
                );
            })}
             {filteredLogs.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm">No se encontraron registros.</div>
            )}
        </div>
      </div>
    </div>
  );
};