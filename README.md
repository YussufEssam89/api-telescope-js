# @jotech/api-telescope-js

A professional, real-time API monitoring dashboard (Telescope-like) for Next.js applications. Monitor page navigations, internal API calls, and external backend requests in a single, beautiful dark-mode interface.

## Features

- 🎯 **Unified Tracking**: Monitor Middleware, Internal APIs, and External Backend calls in one place.
- 🚀 **Real-time Updates**: Live stream of request activity with status codes and durations.
- 📦 **Full Payload Inspection**: View complete JSON Request and Response bodies.
- 🎨 **Premium UI**: Modern, responsive dark-mode dashboard built with Framer Motion and Lucide icons.
- 🛠️ **Easy Integration**: Simple Higher-Order Component (HOC) and React component integration.

## Installation

```bash
npm install @jotech/api-telescope-js
# or
yarn add @jotech/api-telescope-js
```

## Setup

### 1. Global Type Support
Add `apiLogs` to your global types (e.g., `src/globals.d.ts`):

```typescript
import { ApiLogEntry } from '@jotech/api-telescope-js';

declare global {
  var apiLogs: ApiLogEntry[];
}
```

### 2. Debug Dashboard
Create a debug page (e.g., `app/debug/page.tsx`) to view the logs:

```tsx
'use client';
import { Dashboard } from '@jotech/api-telescope-js';

export default function DebugPage() {
  return <Dashboard title="Project Telescope" />;
}
```

### 3. API Logs Endpoint
Create an API route to serve the logs (e.g., `app/api/debug-logs/route.ts`):

```typescript
import { apiLogs } from '@jotech/api-telescope-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(apiLogs);
}
```

## Credits

Developed by Jotech.
