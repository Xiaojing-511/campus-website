<template>
    <div id="container">
        <el-dialog
            title="群发消息"
            :visible.sync="sendMoreDialogVisible"
            width="40%"
            >
            <el-input
                type="textarea"
                placeholder="请输入消息内容"
                v-model="sendContents"
                :rows="4"
                maxlength="100"
                show-word-limit
            >
            </el-input>
            <p style="margin: 10px 0">发送给:</p>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div class="checkbox-box">
                <el-checkbox-group v-model="sendUsers" >
                    <el-checkbox :label="item" v-for="item in checkboxList" :key="item"></el-checkbox>
                </el-checkbox-group>
            </div>
            <el-button type="primary" size="small" @click="sendMoreMessage">群发消息</el-button>
        </el-dialog>
        <info-dialog style="position:absolute" :userId="userId" :updateList="getUserFriends"><span id="clickSpan1"></span></info-dialog>
        <div id="side">
            <el-button class="more-send-btn" type="primary" size="small" round @click="clickSendMore">群发消息</el-button>
            <ul ref="chatList">
                <li v-for="item in chatUserList" :key="item.ufid" class="list-item">{{item.ufriendId}}</li>
            </ul>
        </div>
        
        <div id="content">
            <div id="user-info">
                <p class="user-name" @click="showInfoDialog(receptionId)">{{receptionId}}</p>
            </div>
            <div id="chat" ref="chat">
                <ul>
                    <li v-for="item in chatContentsList" :key="item.cid" :class="[ item.sendId === $store.getters.uid ? 'chat-right' : 'chat-left' ,'chat-content']">
                        <span @click="showInfoDialog(item.sendId)" >
                            <el-avatar class="user-img img-left" v-if="item.sendId !== $store.getters.uid" :src="item.uImageSrc" alt="111"></el-avatar>
                        </span>
                        <div v-if="item.chatImage"  class="img-box">
                            <div>
                                <el-image class="commodity-img" :src="item.chatImage" :preview-src-list="[item.chatImage]" alt=""/>
                            </div>
                        </div>
                        <span v-else class="content-text">{{item.chatContents}}</span>
                        <span @click="showInfoDialog(item.sendId)" >
                            <el-avatar class="user-img img-right" v-if="item.sendId === $store.getters.uid" :src="item.uImageSrc" alt="111"></el-avatar>
                        </span>
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
                <el-upload
                    action="http://localhost:3000/addChatPhoto"
                    ref="upload"
                    name="filechat"
                    accept="jpg, png, jpeg"
                    :show-file-list="false"
                    :file-list="fileList"
                    :on-change="handleChange"
                    :on-success="handleAvatarSuccess"
                    :auto-upload='false'>
                    <i class="el-icon-picture"></i>
                </el-upload>
                <el-button class="btn" size="mini" type="primary" round @click="sendMessage">发送</el-button>
            </div>
        </div>
    </div>
</template>
<script>
const fileTypes = ['image/png','image/jpeg','image/jpg'];
import InfoDialog from './InfoDialog.vue';
import {createNewChatContents,getChatList,getUserFriends,sendMoreChatContents,judgeUserIsFriend} from '../api/communication';
import { initWebsocket } from '../api/common';
export default {
    name: 'Chat',
    components:{InfoDialog},
    data() {
        return {
            sendId: '',
            receptionId: '',
            chatUserList: [],
            chatContentsList: [],
            sendText: '',
            sendMoreDialogVisible: false,
            sendUsers:[],
            sendContents: '',
            checkAll: false,
            isIndeterminate: false,
            checkboxList: [],
            fileList: [],
            userId: ''
        }
    },
    created(){
        this.$store.dispatch('setUid', window.localStorage.getItem('uid'));   
    },
    async mounted(){
        this.sendId = this.$store.getters.uid;
        this.initWebsocket();     
        this.getUserFriends();
    },
    beforeDestroy(){
        this.ws.close();
    },
    methods:{
        initWebsocket(){
            let _this = this;
            initWebsocket(_this);
            this.ws.onmessage = function (event) {
                let {sendId,receptionId} = JSON.parse(event.data);
                if(Array.isArray(receptionId) && receptionId.includes(_this.sendId)){    
                    receptionId = _this.sendId;
                }
                if(_this.sendId == receptionId && _this.receptionId == sendId){
                    _this.updateChatListHandle();
                }else if(_this.sendId == receptionId && _this.receptionId !== sendId){
                    const oLis = _this.$refs.chatList.getElementsByTagName('li');
                    for (let i = 0; i < oLis.length; i++) {
                        if(oLis[i].innerHTML == sendId){
                            oLis[i].classList.add('new-message')
                        }
                    }
                }
            
            }
        },
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
                    oLis[i].classList.remove('new-message');
                    this.receptionId = oLis[i].innerHTML;
                    this.updateChatListHandle();
                }
            }
        },
        async getUserFriends(){
            await getUserFriends({uid: this.sendId}).then(res=>{
                this.chatUserList = res.data;
            });
            if(this.chatUserList.length){
                this.receptionId = this.chatUserList[0].ufriendId;
                const oLis = this.$refs.chatList.getElementsByTagName('li');
                oLis[0].classList.add('active');
                await getChatList({
                        sendId: this.sendId,
                        receptionId: this.receptionId
                    }).then(res=>{
                        this.chatContentsList = res.data
                    });
                this.addLiClick();
            }
        },
        updateChatListHandle(){
            getChatList({
                sendId: this.sendId,
                receptionId: this.receptionId
            }).then(res=>{
                this.chatContentsList = res.data
                this.$nextTick(()=>{
                    this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
                })
            })
        },
        async sendMessage(){
            let _this = this;
            if(this.sendText.trim().length === 0){
                this.$message({
                    message: "发空的消息是没意思的哦~",
                    type: "error"
                });
                this.sendText = ''
            }else{
                await judgeUserIsFriend({
                    uid: this.sendId,
                    ufriendId: this.receptionId
                }).then(res=>{
                    if(res.data.isFriend){
                        let message = {
                            sendId: this.sendId,
                            receptionId: this.receptionId,
                            chatContents: this.sendText,
                            chatImage: ''
                        };
                        createNewChatContents(message).then(()=>{
                            // this.$message({
                            //     message: "消息发送成功",
                            //     type: "success"
                            // });
                            this.sendText = ''
                            this.updateChatListHandle();
                            _this.ws.send(JSON.stringify({type: 'chat',...message}));
                        })
                    }else{
                        this.$message.warning('你们还不是好友哦～');
                        this.getUserFriends();
                    }
                })
            }
        },
        clickSendMore(){
            this.sendMoreDialogVisible = !this.sendMoreDialogVisible;
            let list = [];
            this.chatUserList.forEach(item=>{
                list.push(item.ufriendId);
            })
            this.checkboxList = list;
        },
        handleChange(file){
            if(!fileTypes.includes(file.raw.type)){
                this.$message({
                    type: 'warning',
                    message: '图片仅支持png、jpg及jpeg格式!'
                });
            }else{
                this.fileList.push(file);
                this.$refs.upload.submit();
            }
        },
        handleAvatarSuccess(res){
            let _this = this;
            let message = {
                sendId: this.sendId,
                receptionId: this.receptionId,
                chatContents: this.sendText,
                chatImage: res.imgName
            };
            createNewChatContents(message).then(()=>{
                this.$message({
                    message: "图片发送成功",
                    type: "success"
                });
                this.fileList = [];
                this.updateChatListHandle();
                _this.ws.send(JSON.stringify({type: 'chat',...message}));
            })
        },
        sendMoreMessage(){
            let _this = this;
            if(!this.sendContents.trim()){
                this.$message({
                    type: 'warning',
                    message: '不能群发空消息！'
                })
            }else if(!this.sendUsers.length){
                this.$message({
                    type: 'warning',
                    message: '未选择群发用户！'
                })
            }else{
                let message = {
                    sendId: this.sendId,
                    receptionIds: this.sendUsers,
                    chatContents: this.sendContents,
                    chatImage: ''
                }
                sendMoreChatContents(message).then(res=>{
                    if(res.status === 200){
                        this.$message({
                            type: 'success',
                            message: '群发消息成功'
                        });
                        this.sendMoreDialogVisible = ! this.sendMoreDialogVisible;
                        this.sendUsers = [];
                        this.sendContents = '';
                        this.updateChatListHandle();
                        _this.ws.send(JSON.stringify({type: 'chat',...message}));
                    }
                })
            }
        },
        handleCheckAllChange(val) {
            this.sendUsers = val ? this.checkboxList : [];
            this.isIndeterminate = false;
        },
        showInfoDialog(userId){
            this.userId = userId;
            this.$nextTick(()=>{
                document.getElementById('clickSpan1').click();
            })
        }
    }
}
</script>
<style>
#send-text .el-textarea__inner{
    height: 50px;
}
.checkbox-box .el-checkbox{
    display: block;
    margin: 10px 0;
}
.checkbox-box .el-checkbox .el-checkbox__inner{
    border-radius: 50%;
}
#send-text .el-icon-picture{
    font-size: 27px;
    line-height: 59px;
    margin-left: 3px;
}
</style>
<style lang="scss" scoped>
    #container{
        width: 100%;
        height: 680px;
        background-color: #fff;
        display: flex;
        margin-top: -20px;
        .checkbox-box{
            height: 150px;
            overflow: scroll;
            margin-bottom: 10px;
        }
        #side{
            width: 200px;
            height: 100%;
            position: relative;
            .more-send-btn{
                position: absolute;
                top: 15px;
                left: 10px;
            }
            ul{
                width: 100%;
                margin-top: 60px;
                .list-item{
                    width: 100%;
                    box-sizing: border-box;
                    height: 60px;
                    background-color: #eee;
                    padding: 10px;
                    cursor: pointer;
                    &:hover{
                        background-color: #ddd;
                    } 
                }
                .new-message{
                    position: relative;
                    &::after{
                        content: '';
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        background-color: rgb(219, 58, 9);
                        position: absolute;
                        right: 10px;
                        top: 10px;
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
            #user-info{
                width: 100%;
                height: 60px;
                border-bottom: 1px solid #eee;
                border-left: 1px solid #eee;
                .user-name{
                    cursor: pointer;
                    height: 60px;
                    line-height: 60px;
                    margin-left: 30px;
                }
            }
            #chat{
                height: 559px;
                overflow-y: scroll;
                padding: 10px 30px 0;
                border-left: 1px solid #eee;
                ul{
                    overflow: hidden;
                }
                .chat-content{
                    margin-bottom: 10px;
                    clear: both;
                    .img-box{
                        display: inline-block;
                        width: 180px;
                        vertical-align: top;
                        overflow: hidden;
                        .commodity-img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .content-text{
                        display: inline-block;
                        height: 40px;
                        line-height: 40px;
                        background-color: #eee;
                        padding: 0 10px;
                    }
                    .user-img{
                        margin-bottom: -12px;
                        cursor: pointer;
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
                display: flex;
                .btn{
                    height: 40px;
                    margin: 10px 5px ;
                }
            }
        }
    }
</style>