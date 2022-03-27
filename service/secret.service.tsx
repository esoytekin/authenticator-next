import SecretModel from '../model/secret.model';
import axios, { AxiosResponse } from 'axios';

const SERVICE_URL = '/api/secret';

type ApiResponse<T> = Promise<AxiosResponse<T>>;

const SecretService = {
    get(): ApiResponse<SecretModel[]> {
        return axios.get(SERVICE_URL);
    },
    delete(id: string): ApiResponse<void> {
        return axios.delete(`${SERVICE_URL}/${id}`);
    },
    saveNewSecret(secret: SecretModel): ApiResponse<{ id: string }> {
        return axios.post(SERVICE_URL, secret);
    },
    updateSecret(secret: SecretModel): ApiResponse<{ id: string }> {
        return axios.put(`${SERVICE_URL}/${secret.id}`, secret);
    },
};

export default SecretService;
