// 以class类来实现axios实例化

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
// 自定义 promise interface
import { HttpResponse } from "@/type/index";
class HttpRequest {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // 获取axios实例的配置
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      timeout: 1000 * 10,
    };
    return config;
  }

  // 设定拦截器
  interceptors(instance: AxiosInstance) {
    // 添加请求拦截器
    instance.interceptors.request.use(
      (config) => {
        // 添加token
        const token = sessionStorage.getItem("token") || "";
        if (token) {
          (config.headers as any).Authorization = "Bearer " + token;
        }
        // console.log('config:' + JSON.stringify(config))
        // 在发送请求之前做些什么
        return config;
      },
      (error: Error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    instance.interceptors.response.use(
      (response) => {
        // console.log("response:" + JSON.stringify(response));
        // 对响应数据做点什么
        if (response.status === 200) {
          // return response.data
          // 跟上边直接返回都是一样的（也可以不加Promise.resolve）
          return Promise.resolve(response.data);
        } else {
          return Promise.reject(response);
        }
      },
      (error: Error) => {
        // 对响应错误做点什么
        // debugger
        return Promise.reject(error);
      }
    );
  }

  // 创建实例
  request(options: AxiosRequestConfig) {
    const instance = axios.create();
    const newOptions = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance);
    return instance(newOptions);
  }

  get(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> & Promise<HttpResponse> {
    const options = Object.assign(
      {
        method: "get",
        url: url,
      },
      config
    );
    return this.request(options);
  }

  post(
    url: string,
    data?: any
  ): Promise<AxiosResponse> & Promise<HttpResponse> {
    return this.request({
      method: "post",
      url: url,
      data: data,
    });
  }
}

export default HttpRequest;
