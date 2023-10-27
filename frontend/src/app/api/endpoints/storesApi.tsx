// api/endpoints/storesApi.ts
import {AxiosRequestConfig} from 'axios';
import {fetchJson} from '@/app/api';

export async function getStoresForAdmin() {
    const token = localStorage.getItem('loggedInUserToken');

    const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    };

    return await fetchJson(`/admin/stores`, config);
}

export async function getStoreById(id: string) {
    const token = localStorage.getItem('loggedInUserToken');

    const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    };

    return await fetchJson(`/store/${id}`, config);
}

export async function addNewStoreByAdmin(data: any) {
    const token = localStorage.getItem('loggedInUserToken');

    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        data: JSON.stringify(data),
    };


    return await fetchJson(`/admin/store/add`, config);
}

export async function updateStoreByAdminWithId(id: string, data: any) {
    const token = localStorage.getItem('loggedInUserToken');

    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        data: JSON.stringify(data),
    };

    return await fetchJson(`/admin/store/update/${id}`, config);
}

export async function deleteStoreById(id: string) {
    const token = localStorage.getItem('loggedInUserToken');

    const config: AxiosRequestConfig = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    return await fetchJson(`/admin/store/delete/${id}`, config);
}

export async function getAllProfilesByStoreId(id: string) {
    const token = localStorage.getItem('loggedInUserToken');

    const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    return await fetchJson(`/admin/store/${id}/users`, config);
}

export async function getStoreUsersByRoleAndStoreId(id: string, params: any, role: string) {
    const token = localStorage.getItem('loggedInUserToken');

    switch (role) {
        case "1":
            role = "ROLE_STOREMANAGER";
            break;
        case "2":
            role = "ROLE_EMPLOYEE";
            break;
        case "3":
            role = "ROLE_CLIENT";
            break;
        default:
            role = "ROLE_STOREMANAGER";
            break;
    }

    params.role = role;
    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        data: JSON.stringify(params),
    };

    return await fetchJson(`/store/${id}/users`, config);
}


export async function getStoresForClient(page:number , pageSize:number) {
    const token = localStorage.getItem('loggedInUserToken');

    const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    };

    return await fetchJson(`/client/stores?page=${page}&pageSize=${pageSize}`, config);
}

export async function associateClientToStore(data: any) {
    const token = localStorage.getItem('loggedInUserToken');

    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        data: JSON.stringify(data),
    };

    return await fetchJson(`/client/store/associate`, config);
}







