<template>
    <div id="app">
        <Nav id="nav"></Nav>
        <div id="main">
            <router-view/>
        </div>
    </div>
</template>
<script>
import Nav from '../components/Nav'
export default {
    components:{
        Nav
    }
}
</script>
<style lang="scss">
    #app {
        margin: 40px auto;
        max-width: 1200px;
        background: #f5f5f5;
        box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        overflow: hidden;
        display: flex;
    }
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
</style>