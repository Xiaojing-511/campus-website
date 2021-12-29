import { request } from './ajax';

export const getUserLogin = (params) => {
    return request({
        url: '/userlogin',
        method: 'post',
        data: params
    })
}
export const createAccount = (params) => {
    return request({
        url: '/createAccount',
        method: 'post',
        data: params
    })
}