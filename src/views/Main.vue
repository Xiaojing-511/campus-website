<template>
    <div id="container">
        <el-dropdown id="u-avatar" @command="logout">
            <el-avatar class="el-dropdown-link" :src="uImgSrc"></el-avatar>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="user" disabled >{{uid}}</el-dropdown-item>
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
import Nav from '../components/Nav'
import {getUserInfo} from '../api/communication'
export default {
    name: 'Main',
    data() {
        return {
            uid: window.localStorage.getItem('uid'),
        }
    },
    computed:{
        uImgSrc(){
            return this.$store.getters.uImgSrc
        }
    },
    components:{
        Nav
    },
    created(){
        getUserInfo({uid: this.uid}).then(res=>{
            console.log('info',res.data.info);
            this.$store.dispatch('setUImgSrc',res.data.info.uImageSrc);
            this.$store.dispatch('setUStyleText',res.data.info.styleText);
        })
    },
    methods:{
        logout(item){
            if(item === 'out'){
                window.localStorage.setItem('uid','');
                this.$router.push('/login');
            }
        }
    }
}
</script>
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