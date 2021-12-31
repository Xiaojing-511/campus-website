<template>
    <header>
        <!-- <img src="../images/indite-logo.png" alt="" width="150px"> -->
        <p>I can do everything!</p>
        <nav id="nav-header">
            <ul ref="navUl"> 
                <li class="menu-item active">
                    <router-link to="/main/home">Home</router-link>
                </li>
                <li class="menu-item">
                    <router-link to="/main/chat">Chat</router-link> 
                </li>
                <li class="menu-item">
                    <router-link to="/main/others">Others</router-link> 
                </li>
            </ul>
        </nav>
    </header>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        addLiClick(){
            const oLis = this.$refs.navUl.getElementsByTagName('li');
            for (let i = 0; i < oLis.length; i++) {
                oLis[i].onclick = function(){
                    for (let j = 0; j < oLis.length; j++) {
                        if(oLis[j].classList.value.includes('active')){
                            oLis[j].classList.remove('active')
                        }
                    }
                    oLis[i].classList.add('active');
                }
            }
        }
    },
    mounted(){
        this.addLiClick();
    }
}
</script>
<style lang="scss" scoped>
header{
    box-sizing: border-box; //
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05), 1px 0 rgba(0, 0, 0, 0.05);
    border-top: 10px solid #32c1fb;
    background: #fff;
    
    #nav-header{
        margin-top: 50px;
        .menu-item{
            margin-left: -50px;
            padding-left: 50px;
            &:hover{
                cursor: pointer;
            }
            a{
                color: #666666;
                font-size: 18px;
                font-weight: 600;
                width: 220px;
                height: 20px;
                line-height: 20px;
                display: inline-block;
                padding: 16px 50px;
                margin-left: -50px; //
                &:hover{ //&为less语法  表示当前选择器的父级
                    background: #f5f5f5;
                    color: #333;
                }
            }
            &.active{
                position: relative;
                a{
                    color: #333;
                }
                // 选中标识
                &::before{
                    content: '';
                    display: block;
                    width: 14px;
                    height: 14px;
                    background: #e3e3e3;
                    position: absolute;
                    left: -7px;
                    top: 19px;
                    transform: rotate(45deg);
                }
            }
        }   
    }
}
</style>