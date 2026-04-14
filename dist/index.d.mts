import React from 'react';

interface ApiLogEntry {
    id: string;
    url: string;
    method: string;
    status: number;
    duration: number;
    timestamp: string;
    requestBody?: string;
    responseBody?: string;
    source?: 'MW' | 'API' | 'BACKEND';
}

declare const apiLogs: ApiLogEntry[];
declare const pushLog: (log: Omit<ApiLogEntry, "id">) => void;

interface DashboardProps {
    endpoint?: string;
    title?: string;
}
declare const Dashboard: React.FC<DashboardProps>;

export { type ApiLogEntry, Dashboard, apiLogs, pushLog };
