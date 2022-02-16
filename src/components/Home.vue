<template>
<div>
    <div id="new-state">
        <el-button v-show="!isWriting" class="new-btn" size="mini" type="primary" round @click="isWriting = !isWriting">发条动态</el-button>
        <el-input
            v-show="isWriting"
            type="textarea"
            placeholder="请输入内容"
            v-model="newText"
            maxlength="30"
            show-word-limit
        >
        </el-input>
        <el-button v-show="isWriting" class="btn" size="mini" type="primary" round @click="addState">发一条</el-button>
    </div>
    <main>
        <section>
            <article v-for="(item) in articles" :key="item.id">
                 <el-dialog
                    title="个人信息"
                    :visible.sync="dialogVisible"
                    width="40%">
                    <div style="width:100%;position:relative;margin-top:-30px">
                        <div v-show="uid!==info.uid">
                            <el-button v-show="!isFriend" @click="addFriend" class="add-btn" type="primary" round>加好友</el-button>
                            <el-button v-show="isFriend" class="add-btn" type="success" round>已为好友</el-button>
                        </div>
                        <div class="user-info">
                            <span>用户名: {{info.uid}}</span>
                        </div>
                    </div>
                </el-dialog>
                <span @click="showInfo(item)">
                    <el-avatar class="el-dropdown-link status-avatar" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                </span>
                <span class="status-info" >{{item.uid}}</span>
                <span class="status-info">{{item.createTime}}</span>
                <p>{{item.contents}}</p>
            </article>
        </section>
    </main>
</div>
</template>
<script>
import { judgeEmptyStr } from '@/api/common';
import { createUserStatus,getAllUserStatus,addFriend,judgeUserIsFriend } from '@/api/communication'
export default {
    data() {
        return {
            uid: window.localStorage.getItem('uid'),
            articles: [],
            newText: '',
            isWriting: false,
            dialogVisible: false,
            info:{},
            isFriend: false
        }
    },
    created(){
        this.getStatus();
    },
    methods:{
        getStatus(){
            getAllUserStatus().then(res=>{
                this.articles = res.data;
            })
        },
        addState(){
            if(!judgeEmptyStr(this.newText)){
                let obj = {
                    uid: window.localStorage.getItem('uid'),
                    sid: ''+Math.random()*Math.random(),
                    contents: this.newText,
                };
                createUserStatus(obj).then(res=>{
                    console.log('res',res);
                    this.isWriting = !this.isWriting
                    this.$message({
                        message: "动态发送成功",
                        type: "success"
                    });
                    this.newText = '';
                    this.getStatus();
                    
                }).catch(err=>{
                    console.log(err);
                })
            }else{
                this.$message({
                    message: "发空的动态是没意思的哦~",
                    type: "error"
                });
                this.newText = '';
            }
        },
        showInfo(info){
            this.dialogVisible = true;
            this.info.uid = info.uid;
            // 判断是否互为好友
            judgeUserIsFriend({
                uid: this.uid,
                ufriendId: this.info.uid
            }).then(res=>{
                console.log('res',res);
                this.isFriend = res.data.isFriend
            })
        },
        addFriend(){
            addFriend({
                uid: this.uid,
                ufriendId: this.info.uid
            }).then(res=>{
                console.log('res',res);
                this.$message.success('添加好友成功，快去聊天吧～');
                this.isFriend = true;
            })
        }

    }
}
</script>
<style lang="scss" scoped>
#new-state{
    height: 54px;
    display: flex;
    margin-bottom: 10px;
    margin-top: -20px;
    position: relative;
    .btn{
        height: 40px;
        margin: 7px 5px 0 10px;
    }
    .new-btn{
        height: 40px;
        position: absolute;
        top: 7px;
        right: 5px;
    }
}
main{
    section{
        article {
            width: 100%;
            background: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 19px;
            line-height: 1.6em;
            padding: 10px;
            .add-btn{
                position: absolute;
                right: 0;
            }
            .user-info{
            }
            .status-avatar{
                cursor: pointer;
            }
            .status-info{
                font-size: 12px;
                height: 20px;
                line-height: 20px;
                background-color: #eee;
                border-radius: 5px;
                margin: 0px 10px;
                padding: 5px;
                vertical-align: text-top;
            }
            p{
                padding: 10px;
            }
        }
    }
}
</style>