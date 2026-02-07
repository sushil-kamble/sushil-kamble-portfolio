import axios, { type AxiosInstance } from 'axios';
import { INTEGRATION_TOKEN, BASE_URL } from '$env/static/private';

export const useAxios = (header: Record<string, string> | null = null): AxiosInstance => {
	return axios.create({
		baseURL: BASE_URL,
		headers: {
			Authorization: 'Bearer ' + INTEGRATION_TOKEN,
			'Notion-Version': '2022-06-28',
			...(header || {})
		}
	});
};
