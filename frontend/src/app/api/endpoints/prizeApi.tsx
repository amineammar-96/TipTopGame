// api/endpoints/prizeApi.tsx
import { AxiosRequestConfig } from 'axios';
import { fetchJson } from '@/app/api';

export async function getPrizes() {
    const token = localStorage.getItem('loggedInUserToken');

    const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    };

    return await fetchJson(`/prizes/`, config);
}
