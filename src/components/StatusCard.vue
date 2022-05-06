<template>
    <div>
        <info-dialog :userId="item.uid">
            <el-avatar class="el-dropdown-link status-avatar" :src="item.uImageSrc"></el-avatar>
        </info-dialog>
        <span class="status-info-user" >{{item.uid}}</span>
        <div class="status-content">
            <p class="topic" v-if="item.type === '#话题讨论'">{{item.type}}</p>
            <p class="status-contents">{{item.contents}}</p>
            <div class="img-box" v-for="(itemImg,index) in item.image" :key="index" >
                <div>
                    <el-image class="status-img" :src="itemImg" :preview-src-list="[itemImg]" alt=""/>
                </div>
            </div>
            <div>
                <el-tag size="medium">{{item.type}}</el-tag>
            </div>
            <p>
                <span class="status-info-time">{{item.createTime}}</span>
                <span class="delete" @click="deleteDialogVisible = true" v-if="uid == item.uid || utype === 'manager'">删除</span>
                <el-dialog
                    title="提示"
                    :visible.sync="deleteDialogVisible"
                    width="30%"
                    center>
                    <span>确认要删除该条动态吗？删除后不可恢复</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="deleteDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="deleteStatus(item.sid)">确 定</el-button>
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
                        <i class="el-icon-chat-square comment"></i>
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
                    <span class="delete delete-btn" @click="deleteComment(item)" v-if="uid == item.commentUser || utype === 'manager'">删除</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { deleteUserStatus,getStatusComment,addStatusComment,deleteStatusComment } from '@/api/communication'
import InfoDialog from './InfoDialog.vue';
export default {
    components:{InfoDialog},
    data(){
        return {
            uid: window.localStorage.getItem('uid'),
            deleteDialogVisible: false,
            showDetail: false,
            commentInput: false,
            commentContent: '',
            commentsList: [],
        }
    },
    props:['item',"utype"],
    created(){
        this.getStatusComment();
        document.addEventListener('click', this.listenerHandle,true)
    },
    beforeDestroy(){
        document.removeEventListener('click', this.listenerHandle,true)
    },
    methods:{
        getStatusComment(){
            getStatusComment({
                sid: this.item.sid
            }).then(res=>{
                this.commentsList = res.data;
            }).catch(err=>console.log(err));
        },
        deleteStatus(sid){
            console.log('sid',sid);
            deleteUserStatus({sid}).then(res=>{
                console.log(res);
                if(res.status === 200){
                    this.deleteDialogVisible = false;
                    this.$message({
                        message: "动态删除成功",
                        type: "success"
                    });
                    this.$parent.getStatus();
                }
            })
        },
        deleteComment(item){
            deleteStatusComment({commentId: item.scid}).then(res=>{
                if(res.status === 200){
                    this.$message({type: 'success', message: '删除评论成功'});
                    this.getStatusComment();
                }else{
                    console.log(res);
                }
            })
            console.log('delete', item);
        },
        commentHandle(){
            this.commentInput = true;
            this.showDetail = !this.showDetail;
        },
        listenerHandle(e){
            this.$refs.commentInput && this.commentInput && !this.$refs.commentInput.contains(e.target) ? 
            this.commentInput = false : '';
        },
        sendComment(){
            addStatusComment({
                sid: this.item.sid,
                commentUser: this.uid,
                commentContent: this.commentContent
            }).then(res=>{
                if(res.status === 200){
                    this.commentContent = '';
                    this.getStatusComment();
                    this.commentInput = false;
                }else{
                    console.log(res);
                }
            }).catch(err=>console.log(err));
        }
    }
}
</script>
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
    .topic{
        color: #409EFF;
        font-size: 14px;
    }
    .status-contents{
        color: #181818;
        margin-bottom: 5px;
    }
    .img-box{
        display: inline-block;
        width: 250px;
        height: 250px;
        overflow: hidden;
        margin-right: 10px;
        margin-bottom: 0;
        .status-img{
            width: 100%;
            height: 100%;
        }
    }
    .status-info-time{
        color: #aaa;
        font-size: 12px;
        margin-right: 5px;
    }
    .delete{
        font-size: 12px;
        color: #576C95;
        cursor: pointer;
        &:hover{
            color: #EC3941;
        }
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
                    vertical-align: bottom;
                }
                .comment{
                    transform: translateY(-5px);
                }
                span{
                    margin-left: 2px;
                    font-size: 14px;
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
            margin: 0;
            // padding: 5px 0;
            border-bottom: 1px solid #EAEAEA;
            position: relative;
            .user{
                color: #576C95;
                margin: 0 2px 0 10px;
                cursor: pointer;
            }
            .content{
                color: #181818;
            }
            .delete-btn{
                position: absolute;
                right: 5px;
                font-size: 12px;
                transform: scale(0.9);
            }
        }
    }
}
</style>
