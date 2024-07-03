import { AxiosRequestConfig } from 'axios';

export const createGetConfig = (url: string, accessToken: string): AxiosRequestConfig => {
    return {
        method: 'get',
        url: url,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json'
        },
    }
};

export const createPostConfig = (url: string, accessToken: string, data: object): AxiosRequestConfig => {
    return {
        method: 'post',
        url: url,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json'
        },
        data: data
    }
};