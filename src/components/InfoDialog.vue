<template>
<div style="display:inline-block">
    <el-dialog
        title="个人信息"
        :visible.sync="dialogVisible"
        width="40%">
        <div style="width:100%;position:relative;margin-top:-30px">
            <div v-show="uid!==info.uid">
                <el-button v-show="!isFriend" @click="addFriend" class="add-btn" type="primary" round>加好友</el-button>
                <el-button v-show="isFriend" disabled class="add-btn" type="success" round>已为好友</el-button>
            </div>
            <p>用户名: {{info.uid}}</p>
            <p>座右铭: {{info.styleText}}</p>
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
            this.info.uid = userId;
            // 判断是否互为好友
            await judgeUserIsFriend({
                uid: this.uid,
                ufriendId: this.info.uid
            }).then(res=>{
                this.isFriend = res.data.isFriend
            })
            await getUserInfo({uid: userId}).then(res=>{
                this.info.uid = res.data.info.uid;
                this.info.styleText = res.data.info.styleText;
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
<style lang="scss" scoped>

</style>