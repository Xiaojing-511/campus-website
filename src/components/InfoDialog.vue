<template>
<div style="display:inline-block">
    <el-dialog
        title="个人信息"
        :visible.sync="dialogVisible"
        width="40%">
        <div class="info-container">
            <div v-show="!(uid == info.uid)">
                <el-button v-show="!isFriend" @click="addFriend" class="add-btn" type="primary" round>加好友</el-button>
                <el-button v-show="utype === 'manager'" @click="cancelDialogVisible = !cancelDialogVisible" class="add-btn" type="danger" round>注销用户</el-button>
                <el-button v-show="utype !== 'manager' && isFriend" @click="deleteDialogVisible = !deleteDialogVisible" class="add-btn" type="danger" round>删除好友</el-button>
            </div>
            <el-avatar class="el-dropdown-link" :src="info.uImageSrc"></el-avatar>
            <p class="info"><span>用户名:</span>{{info.uid}}</p>
            <p class="info"><span>学院:</span>{{info.uacademy}}</p>
            <p class="info"><span>专业:</span>{{info.umajor}}</p>
            <p class="info"><span>年级:</span>{{info.ugrade}}</p>
            <p class="info"><span>个性签名:</span>{{info.styleText}}</p>
        </div>
    </el-dialog>
    <el-dialog
        title="提示"
        :visible.sync="deleteDialogVisible"
        width="30%"
        center>
        <span>确认要删除该好友吗？聊天记录同时被删除，删除后不可恢复</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取 消</el-button>
            <el-button type="danger" @click="deleteFriend">删 除</el-button>
        </span>
    </el-dialog>
    <el-dialog
        title="提示"
        :visible.sync="cancelDialogVisible"
        width="30%"
        center>
        <span>确认要注销该用户吗？删除后不可恢复</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelDialogVisible = false">取 消</el-button>
            <el-button type="danger" @click="deleteUser">删 除</el-button>
        </span>
    </el-dialog>
    <span @click="showInfo(userId)">
        <slot></slot>
    </span>
</div>
</template>
<script>
import {judgeUserIsFriend,getUserInfo,addFriend,deleteFriend } from '@/api/communication'
export default {
    data(){
        return {
            uid: window.localStorage.getItem('uid'),
            utype: '',
            info: {},
            dialogVisible: false,
            isFriend: false,
            deleteDialogVisible: false,
            cancelDialogVisible: false
        }
    },
    props:['userId','updateList'],
    created(){
        getUserInfo({uid: this.uid}).then(res=>this.utype = res.data.info.utype)
    },
    methods:{
        async showInfo(userId){
            // 判断是否互为好友
            await judgeUserIsFriend({
                uid: this.uid,
                ufriendId: userId
            }).then(res=>{
                this.isFriend = res.data.isFriend
            }).catch(err=>console.log(err));
            await getUserInfo({uid: userId}).then(res=>{
                this.info = {...res.data.info};
            }).catch(err=>console.log(err));
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
            }).catch(err=>console.log(err));
        },
        deleteFriend(){
            deleteFriend({
                uid: this.uid,
                friendId: this.info.uid
            }).then(res=>{
                if(res.status === 200){
                    this.$message({
                        type: 'success',
                        message: '删除好友成功！'
                    });
                    this.deleteDialogVisible = !this.deleteDialogVisible;
                    this.dialogVisible = !this.dialogVisible;
                    this.updateList ? this.updateList() : '';
                }
            }).catch(err=>console.log(err));
        },
        deleteUser(){
            console.log('注销用户', this.info);
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
        line-height: 35px;
        span{
            color: #aaa;
            margin-right: 5px;
        }
    }
}
</style>