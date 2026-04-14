import { ApiLogEntry } from "../types";

// Ensure global log store exists (useful for HMR in dev)
// We use a global variable to persist logs across Next.js hot reloads in development
const getGlobalStore = () => {
    if (typeof global !== 'undefined') return global as any;
    if (typeof window !== 'undefined') return window as any;
    return {} as any;
};

const globalStore = getGlobalStore();

if (!globalStore.apiLogs) {
    globalStore.apiLogs = [];
}

export const apiLogs: ApiLogEntry[] = globalStore.apiLogs;

// Helper to push logs with a limit
export const pushLog = (log: Omit<ApiLogEntry, 'id'>) => {
    const newLog = { ...log, id: Math.random().toString(36).substring(7) };
    apiLogs.unshift(newLog); // Add to the beginning
    if (apiLogs.length > 200) {
        apiLogs.pop(); // Remove the oldest
    }
};
