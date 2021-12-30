<template>
    <div id="container">
        <el-dropdown id="u-avatar" @command="logout">
            <el-avatar class="el-dropdown-link" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="out">退出登陆</el-dropdown-item>
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
export default {
    components:{
        Nav
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
            padding: 20px 50px;
        }
        #main{
            flex: 1;
            padding: 40px;
            min-height: 1000px;
            border-top: 10px solid #eee;
        }
    }
}
   
   
</style>