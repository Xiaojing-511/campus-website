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
export const createNewChatContents = (params) => {
    return request({
        url: '/api/createNewChatContents',
        method: 'post',
        data: params
    })
}
export const getChatList = (params) => {
    return request({
        url: '/api/queryChatList',
        method: 'post',
        data: params
    })
}

export const addFriend = (params) => {
    return request({
        url: '/api/addFriend',
        method: 'post',
        data: params
    })
}
export const getUserFriends = (params) => {
    return request({
        url: '/api/queryFriends',
        method: 'post',
        data: params
    })
}
export const judgeUserIsFriend = (params) => {
    return request({
        url: '/api/judgeIsFriend',
        method: 'post',
        data: params
    })
}

