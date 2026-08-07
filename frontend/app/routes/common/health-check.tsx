import type { Route } from './+types/health-check';
import * as F from 'server/facade';
import type { HealthCheckResponse } from 'lib/types';
import { init } from 'server/helpers';

export async function loader() {
  await init().then(datetime => console.info("[HealthCheck] Initialized Application Context at", datetime));
  const result = await F.checkHealth();
  console.info('[HealthCheck] Completed health check result:', result);
  return { result };
}

export default function HealthCheck({ loaderData }: Route.ComponentProps) {

  const data = loaderData.result as HealthCheckResponse;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#4CAF50' }}>Health Check Status</h1>
      <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Status:</strong> 
          <span style={{ marginLeft: '0.5rem', color: data.status === 'UP' ? '#4CAF50' : '#f44336' }}>
            {data.status}
          </span>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Service:</strong> <span style={{ marginLeft: '0.5rem' }}>{data.service}</span>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Version:</strong> <span style={{ marginLeft: '0.5rem' }}>{data.version}</span>
        </div>
        <div>
          <strong>Timestamp:</strong> <span style={{ marginLeft: '0.5rem' }}>{data.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
