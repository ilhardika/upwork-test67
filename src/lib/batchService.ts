import { auth } from './auth';
import type { InsertBatchSettings } from '@shared/schema';

const API_URL = import.meta.env.VITE_API_URL;

export const batchService = {
  async startBatch(settings: InsertBatchSettings) {
    const token = auth.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/start-master-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });

    const data = await response.json();
    
    if (response.ok) {
      return {
        status: response.status,
        data: {
          status: 'success',
          message: data.message || 'Batch started successfully',
          task_id: data.task_id,
        }
      };
    } else {
      // Handle different error status codes
      if (response.status === 200 && data.message?.includes('already running')) {
        throw new Error(data.message);
      }
      
      throw new Error(data.message || 'Failed to start batch');
    }
  },

  async getAuthUrl() {
    const token = auth.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/get_auth_url`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (response.ok && data.auth_url) {
      return data.auth_url;
    } else {
      throw new Error('Failed to get auth URL');
    }
  }
};
