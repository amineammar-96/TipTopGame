// api/endpoints/userApi.ts
import { AxiosRequestConfig } from 'axios';
import { fetchJson } from '@/app/api';

export async function loginClient(data: any) {
    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
      };
      
    
      return await fetchJson(`/login_check_client`, config);
}

export async function loginAdmin(data: any) {
    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
    };


    return await fetchJson(`/login_check_admin`, config);
}


export async function register(data: {
  //[key in keyof typeof test] : (typeof test)[key]
  email:string,
  password:string
}) {
  const config: AxiosRequestConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data),
    };
    
  
    return await fetchJson(`/register`, config)
}


export async function addNewUserForStore(id:string , data: any ){
    const token = localStorage.getItem('loggedInUserToken');


    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,

        },
        data: JSON.stringify(data),
        };


        return await fetchJson(`/store/${id}/user/add`, config)
}

//getUserProdileById
export async function getUserProdileById(id:string) {
    const token = localStorage.getItem('loggedInUserToken');
    const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,

        },
    };


    return await fetchJson(`/user/${id}`, config)
}

//updateUserById
export async function updateUserById(id:string , data: any ){
    const token = localStorage.getItem('loggedInUserToken');
    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,

        },
        data: JSON.stringify(data),
    };


    return await fetchJson(`/user/${id}/update`, config)
}



