<template>
<div style="display:inline-block">
    <el-dialog
        title="个人信息"
        :visible.sync="dialogVisible"
        width="40%">
        <div class="info-container">
            <div v-show="uid!==info.uid">
                <el-button v-show="!isFriend" @click="addFriend" class="add-btn" type="primary" round>加好友</el-button>
                <el-button v-show="isFriend" disabled class="add-btn" type="success" round>已为好友</el-button>
            </div>
            <el-avatar class="el-dropdown-link" :src="info.uImageSrc"></el-avatar>
            <p class="info"><span>用户名:</span>{{info.uid}}</p>
            <p class="info"><span>学院:</span>{{info.uacademy}}</p>
            <p class="info"><span>专业:</span>{{info.umajor}}</p>
            <p class="info"><span>年级:</span>{{info.ugrade}}</p>
            <p class="info"><span>个性签名:</span>{{info.styleText}}</p>
        </div>
    </el-dialog>
    <span @click="showInfo(userId)">
        <slot></slot>
    </span>
</div>
</template>
<script>
import {judgeUserIsFriend,getUserInfo,addFriend } from '@/api/communication'
export default {
    data(){
        return {
            uid: window.localStorage.getItem('uid'),
            info: {},
            dialogVisible: false,
            isFriend: false,
        }
    },
    props:['userId'],
    methods:{
        async showInfo(userId){
            // 判断是否互为好友
            await judgeUserIsFriend({
                uid: this.uid,
                ufriendId: userId
            }).then(res=>{
                this.isFriend = res.data.isFriend
            })
            await getUserInfo({uid: userId}).then(res=>{
                this.info = {...res.data.info};
            })
            this.dialogVisible = true;
        },
        addFriend(){
            addFriend({
                uid: this.uid,
                ufriendId: this.info.uid
            }).then(res=>{
                if(res.status == 200){
                    this.$message.success('添加好友成功，快去聊天吧～');
                    this.isFriend = true;
                }
            })
        }
    }
}
</script>
<style>
.info-container .el-avatar{
    width: 60px;
    height: 60px;
}
</style>
<style lang="scss" scoped>
.info-container{
    width: 100%;
    position: relative;
    margin-top: -30px;
    .add-btn{
        position: absolute;
        right: 0;
    }
    .info{
        span{
            color: #aaa;
            margin-right: 5px;
        }
    }
}
</style>