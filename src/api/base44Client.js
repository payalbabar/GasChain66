import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { mockBase44 } from './mockBase44';
import { mockData } from './mockData';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Initialize mock data
if (appId === 'test-app-id' || !appId) {
  mockData.initialize();
}

//Create a client with authentication required
// Create a client ONLY if we have a valid appId (not null or test-app-id)
const realClient = (appId && appId !== 'test-app-id' && appId !== 'null' && appId !== 'undefined') 
  ? createClient({
      appId,
      token,
      functionsVersion,
      serverUrl: '',
      requiresAuth: false,
      appBaseUrl
    })
  : null;

console.log('Base44 Client Initialized. App ID:', appId, 'Using Mock:', !realClient);
export const base44 = realClient || mockBase44;

