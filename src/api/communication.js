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
export const getUserInfo = (params) => {
    return request({
        url: '/api/getUserInfo',
        method: 'post',
        data: params
    })
}
export const juageUserIdOnly = (params) => {
    return request({
        url: '/api/isOnlyUserId',
        method: 'post',
        data: params
    })
}
export const searchUser = (params) => {
    return request({
        url: '/api/searchUser',
        method: 'post',
        data: params
    })
}

export const updateAccountImg = (params) => {
    return request({
        url: '/api/updateAccountImg',
        method: 'post',
        data: params
    })
}
export const updateAccountInfo = (params) => {
    return request({
        url: '/api/updateAccountInfo',
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
export const getTypesStatus = (params) => {
    return request({
        url: '/api/getTypesStatus',
        method: 'post',
        data: params
    })
}
export const getUserStatus = (params) => {
    return request({
        url: '/api/getUserStatus',
        method: 'post',
        data: params
    })
}
export const addUserStatusImg = (params) => {
    return request({
        url: '/api/addUserStatusImg',
        method: 'post',
        data: params
    })
}
export const getStatusComment = (params) => {
    return request({
        url: '/api/getStatusComment',
        method: 'post',
        data: params
    })
}

export const addStatusComment = (params) => {
    return request({
        url: '/api/addStatusComment',
        method: 'post',
        data: params
    })
}
export const deleteStatusComment = (params) => {
    return request({
        url: '/api/deleteStatusComment',
        method: 'post',
        data: params
    })
}
export const deleteUserStatus = (params) => {
    return request({
        url: '/api/deleteUserStatus',
        method: 'post',
        data: params
    })
}
export const deleteUser = (params) => {
    return request({
        url: '/api/deleteUser',
        method: 'post',
        data: params
    })
}
export const getStatusTagTypes = (params) => {
    return request({
        url: '/api/getStatusTagTypes',
        method: 'get',
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
export const sendMoreChatContents = (params) => {
    return request({
        url: '/api/sendMoreChatContents',
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
export const deleteFriend = (params) => {
    return request({
        url: '/api/deleteFriend',
        method: 'post',
        data: params
    })
}
export const createUserCommodityStatus = (params) => {
    return request({
        url: '/api/createUserCommodityStatus',
        method: 'post',
        data: params
    })
}
export const addCommodityPhoto = (params) => {
    return request({
        url: '/api/addCommodityPhoto',
        method: 'post',
        data: params
    })
}
export const addUserCommodityStatusImg = (params) => {
    return request({
        url: '/api/addUserCommodityStatusImg',
        method: 'post',
        data: params
    })
}
export const getAllUserCommodityStatus = (params) => {
    return request({
        url: '/api/getAllUserCommodityStatus',
        method: 'post',
        data: params
    })
}
export const getTypesCommodityStatus = (params) => {
    return request({
        url: '/api/getTypesCommodityStatus',
        method: 'post',
        data: params
    })
}
export const getUserCommodityStatus = (params) => {
    return request({
        url: '/api/getUserCommodityStatus',
        method: 'post',
        data: params
    })
}
export const deleteUserCommodityStatus = (params) => {
    return request({
        url: '/api/deleteUserCommodityStatus',
        method: 'post',
        data: params
    })
}
export const deleteCommodityComment = (params) => {
    return request({
        url: '/api/deleteCommodityComment',
        method: 'post',
        data: params
    })
}
export const getCommodityTagTypes = (params) => {
    return request({
        url: '/api/getCommodityTagTypes',
        method: 'post',
        data: params
    })
}
export const addCommodityComment = (params) => {
    return request({
        url: '/api/addCommodityComment',
        method: 'post',
        data: params
    })
}
export const getCommodityComment = (params) => {
    return request({
        url: '/api/getCommodityComment',
        method: 'post',
        data: params
    })
}


