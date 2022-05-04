<template>
    <div id="container">
        <info-dialog style="position:absolute" :userId="userId"><span id="clickSpan"></span></info-dialog>
        <el-dialog
            id="addDialog"
            title="添加好友"
            :visible.sync="dialogVisible"
            width="45%"
        >
            <el-input
                id="input"
                placeholder="请输入好友账户名"
                v-model="inputModel"
                clearable>
            </el-input>
            <i class="el-icon-search" @click="search"></i>
        </el-dialog>

        <el-dropdown id="u-avatar" @command="commandHandle">
            <el-avatar class="el-dropdown-link" :src="uImgSrc"></el-avatar>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="user" disabled >{{uid}}</el-dropdown-item>
                <el-dropdown-item command="add-friend" divided >添加好友</el-dropdown-item>
                <el-dropdown-item command="out" divided>退出登陆</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <div id="app">
            <Nav id="nav"></Nav>
            <div id="main">
                <router-view/>
            </div>
        </div>
    </div>
</template>
<script>
import Nav from '../components/Nav';
import InfoDialog from '../components/InfoDialog.vue';
import {getUserInfo,searchUser} from '../api/communication'
export default {
    name: 'Main',
    data() {
        return {
            uid: window.localStorage.getItem('uid'),
            dialogVisible: false,
            inputModel: '',
            userId: ''
        }
    },
    computed:{
        uImgSrc(){
            return this.$store.getters.uImgSrc
        }
    },
    components:{
        Nav,InfoDialog
    },
    created(){
        getUserInfo({uid: this.uid}).then(res=>{
            this.$store.dispatch('setUImgSrc',res.data.info.uImageSrc);
            this.$store.dispatch('setUStyleText',res.data.info.styleText);
        }).catch(err=>console.log(err))
    },
    methods:{
        commandHandle(item){
            if(item === 'out'){
                window.localStorage.removeItem('uid');
                window.localStorage.removeItem('token');
                this.$router.push('/login');
            }else if(item === 'add-friend'){
                this.dialogVisible = !this.dialogVisible
            }
        },
        search(){
            let inputModel = this.inputModel.trim();
            if(inputModel){
                searchUser({uid: inputModel}).then(res=>{
                    if(res.status === 200){
                        if(res.data.isHave){
                            this.userId = inputModel;
                            this.inputModel = '';
                            this.$nextTick(()=>{
                                document.getElementById('clickSpan').click();
                            })
                        }else{
                            this.$message({
                                message: '搜索无结果！',
                                type: 'warning'
                            });
                        }
                    } 
                }).catch(err=>console.log(err))
            }else{
                this.inputModel = '';
            }
        }
    }
}
</script>
<style lang="scss">
#container #addDialog {
    .el-input{
        width: 200px;
        margin-right: 5px;
    }
    .el-icon-search{
        font-size: 20px;
        vertical-align: middle;
        cursor: pointer;
        &:hover{
            color: #409EFF;
            font-size: 22px;

        }
    }
}
</style>
<style lang="scss" scoped>
#container{
    position: relative;
    #u-avatar{
        width: 50px;
        height: 50px;
        position: absolute;
        right: 10px;
        top: -25px;
        .el-dropdown-link{
            cursor: pointer;
        }
    }
    #app {
        margin: 40px auto;
        max-width: 1200px;
        background: #f5f5f5;
        box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        
        #nav{
            width: 320px;
            height: 1090px;
            padding: 20px 50px;
        }
        #main{
            flex: 1;
            padding: 40px;
            min-height: 1000px;
            height: 1000px;
            overflow: scroll;
            border-top: 10px solid #eee;
        }
    }
}
   
   
</style>