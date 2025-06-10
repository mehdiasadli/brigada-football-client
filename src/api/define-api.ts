import axios from 'axios';
import { ApiError } from './api-error';
import type { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import { useTokenStore } from '../stores/token.store';

export type SuccessResponse<T> = {
  data: T;
  message: string;
  path: string;
  statusCode: number;
  success: true;
  timestamp: string;
};

export class Api {
  private instance: AxiosInstance;

  private constructor(base: string, config?: CreateAxiosDefaults) {
    const inst = axios.create({
      baseURL: import.meta.env.VITE_SERVER_URL + base,
      ...config,
    });

    inst.defaults.paramsSerializer = {
      indexes: null,
    };

    inst.interceptors.request.use((config) => {
      const token = useTokenStore.getState().token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    inst.interceptors.response.use(
      function onFulfilled(response) {
        return response;
      },

      function onRejected(error) {
        const err = ApiError.fromResponse(error);

        if (err.status === 401) {
          useTokenStore.getState().removeToken();
        }

        return Promise.reject(err);
      }
    );

    this.instance = inst;
  }

  static create(base: string, config?: CreateAxiosDefaults) {
    return new Api(base, config);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<SuccessResponse<T>> {
    const response = await this.instance.get<T>(url, config);

    return response.data as SuccessResponse<T>;
  }

  async post<T, D>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<SuccessResponse<T>> {
    const response = await this.instance.post<T>(url, data, config);

    return response.data as SuccessResponse<T>;
  }

  async put<T, D>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<SuccessResponse<T>> {
    const response = await this.instance.put<T>(url, data, config);

    return response.data as SuccessResponse<T>;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<SuccessResponse<T>> {
    const response = await this.instance.delete<T>(url, config);

    return response.data as SuccessResponse<T>;
  }
}
