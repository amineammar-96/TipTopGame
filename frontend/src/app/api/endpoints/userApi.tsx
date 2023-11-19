// api/endpoints/userApi.ts
import { AxiosRequestConfig } from 'axios';
import { fetchJson } from '@/app/api';

const facebookclientid = process.env.FACEBOOK_CLIENT_ID;


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


//getClients
export async function getClients(searchParams: any) {
    const token = localStorage.getItem('loggedInUserToken');

    const baseUrl = '/admin/clients';

    const queryString = Object.keys(searchParams)
        .filter((key) => searchParams[key] !== '')
        .map((key) => `${key}=${encodeURIComponent(searchParams[key])}`)
        .join('&');
    const finalUrl = `${baseUrl}${queryString ? `?${queryString}` : ''}`;


    const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,

        },
    };

    return await fetchJson(finalUrl, config);
}


export async function getParticipants(searchParams: any) {
    const token = localStorage.getItem('loggedInUserToken');

    searchParams = {
        ...searchParams,
        'status': "",
    }
    const baseUrl = '/admin/participants';

    const queryString = Object.keys(searchParams)
        .filter((key) => searchParams[key] !== '')
        .map((key) => `${key}=${encodeURIComponent(searchParams[key])}`)
        .join('&');
    const finalUrl = `${baseUrl}${queryString ? `?${queryString}` : ''}`;
    const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,

        },
    };

    return await fetchJson(finalUrl, config);
}


//facebookCallBack
export async function facebookCallBack() {
    const data = {
        "code": "621713663395181",
    };

    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    };

    return await fetchJson('/oauth/facebook/callback', config);
}

export async function getClientDashboardCardsCounters() {
    const token = localStorage.getItem('loggedInUserToken');
    const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,

        },
    };

    return await fetchJson('/client/dashboard/counters', config);
}

export async function getAdminDashboardCardsCounters(searchParams: any) {
    const token = localStorage.getItem('loggedInUserToken');
    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        data: JSON.stringify(searchParams),
    };

    return await fetchJson('/admin/dashboard/counters', config);

}


export async function getDashboardStatsData(searchParams: any) {
    const token = localStorage.getItem('loggedInUserToken');

    const baseUrl = '/dashboard/stats';

    const queryString = Object.keys(searchParams)
        .filter((key) => searchParams[key] !== '')
        .map((key) => `${key}=${encodeURIComponent(searchParams[key])}`)
        .join('&');
    const finalUrl = `${baseUrl}${queryString ? `?${queryString}` : ''}`;
    const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,

        },
    };

    return await fetchJson(finalUrl, config);

}

export async function getUserPersonalInfo(id:string) {
    const token = localStorage.getItem('loggedInUserToken');
    const config: AxiosRequestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    return await fetchJson('/user/'+id+'/personal_info', config);
}


export async function sendActivationAccountEmailForUser(id:string) {
    const token = localStorage.getItem('loggedInUserToken');
    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    return await fetchJson('/user/'+id+'/send_activation_email', config);
}

export async function checkActivationTokenValidityClient(data: any) {
    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
    };

    return await fetchJson(`/client/check_activation_token_validity`, config)
}



export async function updateUserProfileInfo(id:string , data: any ) {
    const token = localStorage.getItem('loggedInUserToken');
    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,

        },
        data: JSON.stringify(data),
    };

    return await fetchJson(`/user/${id}/update_profile_info`, config)

}

//uploadAvatar

export async function uploadAvatar(id:string , data: any ) {
    const token = localStorage.getItem('loggedInUserToken');

    const formData = new FormData();
    formData.append('avatar_file', data);

    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        data: formData,
    };

    return await fetchJson(`/user/${id}/update_avatar`, config)

}