export interface ApiLogEntry {
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
