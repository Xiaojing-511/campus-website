<template>
    <div id="container">
        <div id="side">
            <ul ref="chatList">
                <li v-for="item in chatUserList" :key="item.id" class="list-item">{{item.id}}</li>
            </ul>
        </div>
        <div id="content">
            <div id="user-info">
                <p class="user-name">{{userName}}</p>
            </div>
            <div id="chat">
                <ul>
                    <li v-for="item in chatContentsList" :key="item.cid" :class="[ item.sendid === $store.getters.uid ? 'chat-right' : 'chat-left' ,'chat-content']">
                        <img class="user-img img-left" v-if="item.sendid !== $store.getters.uid" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="111">
                        <span>{{item.contents}}</span>
                        <img class="user-img img-right" v-if="item.sendid === $store.getters.uid" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="111">
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userName: '',
            chatUserList: [
                {
                    id: '20185855'
                },
                {
                    id: 'xiaozhang'
                },
                {
                    id: 'xiaoli'
                },
            ],
            chatContentsList: [
                {
                    cid: '153135',
                    sendid: '20185855',
                    contents: '能够看见不',
                    sendTime: '13:24'
                },
                {
                    cid: '153125',
                    sendid: '139',
                    contents: '能',
                    sendTime: '13:25'
                },
            ]
        }
    },
    created(){
        this.$store.dispatch('setUid', window.localStorage.getItem('uid'))
        console.log(this.$store.getters.uid);
        this.userName = this.chatUserList[0].id;
    },
    mounted(){
        this.addLiClick();
        const oLis = this.$refs.chatList.getElementsByTagName('li');
        oLis[0].classList.add('active');
    },
    methods:{
        addLiClick(){
            const oLis = this.$refs.chatList.getElementsByTagName('li');
            for (let i = 0; i < oLis.length; i++) {
                oLis[i].onclick = ()=>{
                    for (let j = 0; j < oLis.length; j++) {
                        if(oLis[j].classList.value.includes('active')){
                            oLis[j].classList.remove('active')
                        }
                    }
                    oLis[i].classList.add('active');
                    this.userName = oLis[i].innerHTML;
                }
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
        }
    }
</style>