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
    <article v-for="(item) in articles" :key="item.sid">
        <status-card :item = "item"></status-card>
    </article>
</div>
</template>
<script>
import { judgeEmptyStr } from '@/api/common';
import StatusCard from './StatusCard.vue';
import { createUserStatus,getAllUserStatus, } from '@/api/communication'
export default {
    components:{StatusCard},
    data() {
        return {
            uid: window.localStorage.getItem('uid'),
            articles: [],
            newText: '',
            isWriting: false,
            dialogVisible: false,
        }
    },
    created(){
        this.getStatus();
    },
    mounted(){
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
                    uid: this.uid,
                    contents: this.newText,
                };
                createUserStatus(obj).then(res=>{
                    if(res.status == 200){
                        this.isWriting = !this.isWriting
                        this.$message({
                            message: "动态发送成功",
                            type: "success"
                        });
                        this.newText = '';
                        this.getStatus();
                    }
                    
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
article {
    width: 100%;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    margin-bottom: 20px;
    font-size: 19px;
    line-height: 1.6em;
    padding: 10px;
    
}
</style>