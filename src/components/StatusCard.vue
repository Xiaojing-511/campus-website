<template>
<div>
    <info-dialog :userId="item.uid">
        <el-avatar class="el-dropdown-link status-avatar" :src="item.uImageSrc"></el-avatar>
    </info-dialog>
    <span class="status-info-user" >{{item.uid}}</span>
    <p>{{item.contents}}</p>
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
            <el-button type="primary" @click="deleteStatus(item.sid)">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import { deleteUserStatus } from '@/api/communication'
import InfoDialog from './InfoDialog.vue';
export default {
    components:{InfoDialog},
    data(){
        return {
            uid: window.localStorage.getItem('uid'),
            deleteDialogVisible: false,
        }
    },
    props:['item'],
    methods:{
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
        }
    }
}
</script>
<style lang="scss" scoped>
.add-btn{
    position: absolute;
    right: 0;
}
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
.status-info-time{
    color: #aaa;
    font-size: 12px;
    margin: 0px 10px;
    vertical-align: text-top;
}
.delete{
    font-size: 12px;
    color: #576C95;
    cursor: pointer;
}
p{
    padding: 10px;
}
</style>
