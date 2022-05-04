import axios from "axios";
import Router from '../router';
import { Message } from 'element-ui';
// 普通接口
const request = axios.create({
    baseURL: '',
    timeout: 50000, // 请求超时时间,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params: {},
  })
  request.interceptors.request.use(
    (config) => {
      // 在请求头中添加token
      config.headers.Authorization = window.localStorage.getItem("token")
      return config
    },
    (error) => {
      Promise.reject(error)
    }
  )

  request.interceptors.response.use(
    (response) => {
      if (response.data.status === 200) {
        return Promise.resolve(response.data)
      }
      else if(response.data.status === 50014){
        window.localStorage.removeItem('uid');
        window.localStorage.removeItem('token');
        Message({type: 'warning', message:'登陆过期！请重新登陆'})
        Router.push('/login');
        return Promise.reject(response.data)
      }
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  
  export { request }