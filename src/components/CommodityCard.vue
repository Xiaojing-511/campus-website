<template>
    <div>
        <info-dialog :userId="item.uid">
            <el-avatar class="el-dropdown-link status-avatar" :src="item.uImageSrc"></el-avatar>
        </info-dialog>
        <span class="status-info-user" >{{item.uid}}</span>
        <div class="status-content">
            <p>{{item.contents}}</p>
            <img class="commodity-img" v-for="(itemImg,index) in item.image" :key="index" :src="itemImg" alt=""/>
            <div>
                <el-tag>{{item.type}}</el-tag>
            </div>
            <p>
                <span class="status-info-time">{{item.createTime}}</span>
                <span class="delete" @click="deleteDialogVisible = true" v-if="uid == item.uid">删除</span>
                <el-dialog
                    title="提示"
                    :visible.sync="deleteDialogVisible"
                    width="30%"
                    center>
                    <span>确认要删除该条动态吗？删除后不可恢复</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="deleteDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="deleteStatus(item.cid)">确 定</el-button>
                    </span>
                </el-dialog>
            </p>
            <div class="commodity-operation">
                <div class="box" v-show="showDetail">
                    <div class="icon">
                        <i class="iconfont icon-heart"></i>
                        <span>赞</span>
                    </div>
                    <div class="icon" @click="commentHandle">
                        <i class="el-icon-chat-square"></i>
                        <span>评论</span>
                    </div>
                </div>
                <div class="i-box" @click="showDetail = !showDetail">
                    <i class="el-icon-more"></i>
                </div>
            </div>
            <div class="comment-input" v-show="commentInput" ref="commentInput">
                <el-input
                    id="commentInput"
                    type="textarea"
                    placeholder="评论点什么..."
                    v-model="commentContent"
                    :rows="2"
                    maxlength="50"
                    show-word-limit
                >
                </el-input>
                <el-button :disabled="commentContent.length == 0" @click="sendComment">发送</el-button>
            </div>
            <div id="comments">
                <p class="comment" v-for="item in commentsList" :key="item.ccid">
                    <info-dialog :userId="item.commentUser">
                        <span class="user">{{item.commentUser}}</span>:
                    </info-dialog>
                    <span class="content">{{item.commentContent}}</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import {
    judgeUserIsFriend,
    addFriend,
    getUserInfo,
    getCommodityComment,
    addCommodityComment,
    deleteUserCommodityStatus
} from '../api/communication';
import InfoDialog from './InfoDialog.vue';
export default {
    components:{InfoDialog},
    data() {
      return{
            uid: '',
            dialogVisibleInfo: false,
            info:{},
            isFriend: false,
            showDetail: false,
            commentsList: [],
            commentContent: '',
            commentInput: false,
            deleteDialogVisible: false
      }  
    },
    props:['item'],
    created(){
        this.getCommodityComment();
        document.addEventListener('click', this.listenerHandle,true)
    },
    mounted(){
        this.uid = window.localStorage.getItem('uid');
    },
    beforeDestroy(){
        document.removeEventListener('click', this.listenerHandle,true)
    },
    methods:{
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
        },
        async showInfo(item){
            this.info.uid = item.uid;
            // 判断是否互为好友
            await judgeUserIsFriend({
                uid: this.uid,
                ufriendId: this.info.uid
            }).then(res=>{
                this.isFriend = res.data.isFriend
            })
            await getUserInfo({uid: item.uid}).then(res=>{
                this.info.uid = res.data.info.uid;
                this.info.styleText = res.data.info.styleText;
            })
            this.dialogVisibleInfo = true;
        },
        deleteStatus(cid){
            deleteUserCommodityStatus({cid}).then(res=>{
                if(res.status === 200){
                    this.$message({
                        message: "二手商品动态删除成功",
                        type: "success"
                    });
                    this.deleteDialogVisible = false;
                    this.$parent.updateCommodityList();
                }
            })
        },
        listenerHandle(e){
            this.$refs.commentInput && this.commentInput && !this.$refs.commentInput.contains(e.target) ? 
            this.commentInput = false : '';
        },
        commentHandle(){
            this.commentInput = true;
            this.showDetail = !this.showDetail;
        },
        getCommodityComment(){
            getCommodityComment({
                cid: this.item.cid
            }).then(res=>{
                this.commentsList = res.data;
            })
        },
        sendComment(){
            addCommodityComment({
                cid: this.item.cid,
                commentUser: this.uid,
                commentContent: this.commentContent
            }).then(res=>{
                if(res.status === 200){
                    this.commentContent = '';
                    this.getCommodityComment();
                    this.commentInput = false;
                }else{
                    console.log(res);
                }
            })
        }
    }
}
</script>
<style>
.comment-input .el-button{
    margin-left: 10px;
    margin-top: 7px;
    height: 40px;
}
</style>
<style lang="scss" scoped>
.status-avatar{
    cursor: pointer;
}
.status-info-user{
    color: #576C95;
    font-size: 14px;
    line-height: 10px;
    margin: 0px 10px;
    vertical-align: text-top;
}

.status-content{
    margin-left: 10px;
    .status-info-time{
        color: #aaa;
        font-size: 12px;
        // line-height: 10px;
        // vertical-align: text-top;
        margin-right: 5px;
    }
    .delete{
        font-size: 12px;
        // line-height: 10px;
        // vertical-align: text-top;
        color: #576C95;
        cursor: pointer;
    }
    p{
        color: #181818;
    }
    .commodity-img{
        width: 200px;
        margin: 10px 10px 0px 0px;
    }
    .commodity-operation{
        position: relative;
        height: 30px;
        .box{
            width: 150px;
            height: 30px;
            padding: 5px;
            background: #4C5054;
            position: absolute;
            right: 40px;
            top: -10px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between; 
            .icon{
                width: 70px;
                display: inline-block;
                cursor: pointer;
                color: #fff;
                text-align: center;
                i{
                    font-size: 20px;
                }
                span{
                    margin-left: 2px;
                    font-size: 14px;
                    vertical-align: top;
                }
            }
        }
        .i-box{
            width: 30px;
            height: 20px;
            line-height: 20px;
            background: #F7F7F7;
            border-radius: 4px;
            text-align: center;
            position: absolute;
            right: 0;
            cursor: pointer;
            i{
                color: #576B95;
            }
        }
    }
    .comment-input{
        display: flex;
    }
    #comments{
        width: 100%;
        font-size: 14px;
        background-color: #F7F7F8;
        .comment{
            border-bottom: 1px solid #EAEAEA;
            .user{
                color: #576C95;
                margin: 0 2px 0 10px;
                cursor: pointer;
            }
            .content{
                color: #181818;
            }
        }
    }
}
</style>