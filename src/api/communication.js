import { request } from './ajax';

export const getUserLogin = (params) => {
    return request({
        url: '/api/userlogin',
        method: 'post',
        data: params
    })
}
export const createAccount = (params) => {
    return request({
        url: '/api/createAccount',
        method: 'post',
        data: params
    })
}
export const createUserStatus = (params) => {
    return request({
        url: '/api/createUserStatus',
        method: 'post',
        data: params
    })
}
export const getAllUserStatus = (params) => {
    return request({
        url: '/api/getAllUserStatus',
        method: 'post',
        data: params
    })
}

