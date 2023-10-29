// api/endpoints/tickets.tsx
import {AxiosRequestConfig} from 'axios';
import {fetchJson} from '@/app/api';
import {URL, URLSearchParams} from "url";

interface SearchParams {
    page?: string;
    limit?: string;
    center?: string;
    user?: string;
    status?: string;
    caissier?: string;
    client?: string;
    sort?: string;
    order?: string;
}

export async function getTickets(searchParams: any) {
    const token = localStorage.getItem('loggedInUserToken');

    const baseUrl = '/tickets';
    const searchParamJson: SearchParams = {
        page: '1',
        limit: '10',
        center: searchParams.center || '',
        user: searchParams.user || '',
        status: searchParams.status || '',
        caissier: searchParams.caissier || '',
        client: searchParams.client || '',
        sort: searchParams.sort || '',
        order: searchParams.order || '',
    };


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
        }
    };

    return await fetchJson(finalUrl, config);


}





//checkTicketCodeValidity
export async function checkTicketCodeValidity(ticketCode: string) {
    const token = localStorage.getItem('loggedInUserToken');
    const config: AxiosRequestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        data: JSON.stringify({
            ticketCode: ticketCode,
        }),
    };

    return await fetchJson(`/tickets/check/play`, config);
}


