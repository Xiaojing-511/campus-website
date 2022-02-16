<template>
    <div id="container">
        <div id="side">
            <ul ref="chatList">
                <li v-for="item in chatUserList" :key="item.ufriendId" class="list-item">{{item.ufriendId}}</li>
            </ul>
        </div>
        
        <div id="content">
            <div id="user-info">
                <p class="user-name">{{receptionId}}</p>
            </div>
            <div id="chat">
                <ul>
                    <li v-for="item in chatContentsList" :key="item.cid" :class="[ item.sendId === $store.getters.uid ? 'chat-right' : 'chat-left' ,'chat-content']">
                        <img class="user-img img-left" v-if="item.sendId !== $store.getters.uid" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="111">
                        <span>{{item.chatContents}}</span>
                        <img class="user-img img-right" v-if="item.sendId === $store.getters.uid" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="111">
                    </li>
                </ul>
            </div>
            <div id="send-text">
                <el-input
                    type="textarea"
                    placeholder="说点什么..."
                    v-model="sendText"
                    maxlength="100"
                    show-word-limit
                >
                </el-input>
                <el-button class="btn" size="mini" type="primary" round @click="sendMessage">发送</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import {createNewChatContents,getChatList,getUserFriends} from '../api/communication';
export default {
    data() {
        return {
            receptionId: '',
            chatUserList: [
                // {
                //     id: '20185855'
                // },
                // {
                //     id: 'xiaozhang'
                // },
                // {
                //     id: 'xiaoli'
                // },
            ],
            chatContentsList: [
                // {
                //     cid: '153135',
                //     sendid: '20185855',
                //     contents: '能够看见不',
                //     sendTime: '13:24'
                // },
                // {
                //     cid: '153125',
                //     sendid: '139',
                //     contents: '能',
                //     sendTime: '13:25'
                // },
            ],
            sendText:'',
        }
    },
    created(){
        this.$store.dispatch('setUid', window.localStorage.getItem('uid'))
        
    },
    async mounted(){
        await getUserFriends({uid: this.$store.getters.uid}).then(res=>{
                this.chatUserList = res.data;
        });
        if(this.chatUserList.length){
            this.receptionId = this.chatUserList[0].ufriendId;
            const oLis = this.$refs.chatList.getElementsByTagName('li');
            console.log(' oLis[0]', oLis);
            oLis[0].classList.add('active');
            await getChatList({
                    sendId: this.$store.getters.uid,
                    receptionId: this.receptionId
                }).then(res=>{
                    console.log('chat contents', res.data);
                    this.chatContentsList = res.data
                });
            this.addLiClick();

        }
    },
    methods:{
        async addLiClick(){
            const oLis = this.$refs.chatList.getElementsByTagName('li');
            for (let i = 0; i < oLis.length; i++) {
                oLis[i].onclick = ()=>{
                    for (let j = 0; j < oLis.length; j++) {
                        if(oLis[j].classList.value.includes('active')){
                            oLis[j].classList.remove('active')
                        }
                    }
                    oLis[i].classList.add('active');
                    this.receptionId = oLis[i].innerHTML;
                    this.updateChatListHandle();
                }
            }
            console.log('click');
        },
        getUserFriends(){
            getUserFriends({uid: this.$store.getters.uid}).then(res=>{
                this.chatUserList = res.data;
                this.receptionId = this.chatUserList[0].ufriendId;
            })
        },
        updateChatListHandle(){
            getChatList({
                sendId: this.$store.getters.uid,
                receptionId: this.receptionId
            }).then(res=>{
                this.chatContentsList = res.data
            })
        },
        sendMessage(){
            if(this.sendText.length === 0){
                this.$message({
                    message: "发空的消息是没意思的哦~",
                    type: "error"
                });
                this.sendText = ''
            }else{
                let message = {
                    sendId: this.$store.getters.uid,
                    receptionId: this.receptionId,
                    chatContents: this.sendText
                };
                createNewChatContents(message).then(()=>{
                    this.$message({
                        message: "消息发送成功",
                        type: "success"
                    });
                    this.sendText = ''
                    this.updateChatListHandle();
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    #container{
        width: 100%;
        height: 620px;
        background-color: #fff;
        display: flex;
        margin-top: -20px;
        #side{
            width: 200px;
            height: 100%;
            ul{
                width: 100%;
                margin-top: 60px;
                .list-item{
                    width: 100%;
                    box-sizing: border-box;
                    height: 60px;
                    background-color: #eee;
                    padding: 10px;
                    // margin-bottom: 10px;
                    cursor: pointer;
                    &:hover{
                        background-color: #ddd;
                    }
                    
                }
                .active{
                    background-color: #ccc;
                }
            }
        }
        #content{
            height: 100%;
            flex: 1;
            // background: #ddd;
            #user-info{
                width: 100%;
                height: 60px;
                border-bottom: 1px solid #eee;
                border-left: 1px solid #eee;
                .user-name{
                    height: 60px;
                    line-height: 60px;
                    margin-left: 30px;
                }
            }
            #chat{
                height: 500px;
                overflow-y:scroll;
                // background-color: pink;
                padding: 10px 30px 0;
                .chat-content{
                    margin-bottom: 10px;
                    clear: both;
                    span{
                        display: inline-block;
                        height: 40px;
                        line-height: 40px;
                        background-color: #eee;
                        padding: 0 10px;
                    }
                    .user-img{
                        width: 40px;
                        margin-bottom: -12px;
                    }
                    .img-left{
                        margin-right: 10px;
                    }
                    .img-right{
                        margin-left: 10px;
                    }
                }
                .chat-left{
                    float: left;
                }
                .chat-right{
                    float: right;

                }
            }
            #send-text{
                height: 50px;
                // background-color: pink;
                display: flex;
                .btn{
                    height: 40px;
                    margin: 10px 5px ;
                }
            }
        }
    }
</style>