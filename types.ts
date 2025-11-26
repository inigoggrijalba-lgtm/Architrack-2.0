export interface Project {
  id: string;
  name: string;
  code: string;
  created_at?: string;
  is_archived: boolean; // Changed from optional to required
}

export interface WorkLog {
  id: string;
  project_id: string;
  date: string; // YYYY-MM-DD
  hours: number;
  description: string;
  created_at?: string;
}

export type ViewState = 'register' | 'projects' | 'reports';

// For Report Charting
export interface ChartDataPoint {
  name: string;
  hours: number;
  fill: string; // Color for the bar
}