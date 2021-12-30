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
                <span class="status-info">{{item.uid}}</span>
                <span class="status-info">{{$moment(Number(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}}</span>
                <p>{{item.contents}}</p>
            </article>
        </section>
    </main>
</div>
</template>
<script>
import { judgeEmptyStr } from '@/api/common';
import { createUserStatus,getAllUserStatus } from '@/api/communication'
export default {
    data() {
        return {
            articles: [],
            newText: '',
            isWriting: false
        }
    },
    created(){
        // this.articles = [
        //     {
        //         id: 2,
        //         contents: "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderi"
        //     },
        //     {
        //         id: 1,
        //         contents: "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderi"
        //     },
        // ];
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
                    createTime: Date.now()
                };
                console.log('新动态',obj);
                createUserStatus(obj).then(res=>{
                    console.log(res);
                    this.isWriting = !this.isWriting
                    console.log('newstate', this.newText);

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
            .status-info{
                font-size: 12px;
                height: 20px;
                line-height: 20px;
                background-color: rgb(255, 192, 213);
                border-radius: 5px;
                margin: 5px 10px 0 10px;
                padding: 5px;
            }
            p{
                padding: 10px;
            }
        }
    }
}
</style>