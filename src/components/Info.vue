<template>
    <div id="container">
        <div class="info">
            <div style="width:100px;height:120px;">
                <el-avatar :size="70" :src="imgSrc" style="margin-left:5px"></el-avatar>
                <el-upload
                    action="http://localhost:3000/addAvatar"
                    ref="upload"
                    :on-success="handleAvatarSuccess"
                    auto-upload
                    :limit="1"
                    >
                        <el-button v-show="editing" size="small" type="primary">更换头像</el-button>
                </el-upload>
            </div>
            <strong class="info-id">{{uid}}</strong>
            <el-button @click="editing = !editing" v-show="editingInfo" class="info-btn" size="small" round>编辑资料</el-button>
        </div>
        <div id="tabs">
            <li class="tab active">基本信息</li>
            <li class="tab">我的动态</li>
            <li class="tab">我的二手商品动态</li>
        </div>
        <div class="edit-container" v-show="tab == 'info'">
            <span class="label">座右铭:</span>
            <span class="content" v-show="!editStyleText||!editing">{{this.styleText}}</span>
            <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="editInfostyleText"
                class="input-class"
                maxlength="30"
                show-word-limit
                v-show="editing&&editStyleText"
            >
            </el-input>
            <span class="edit-text" @click="edit" v-show="editing&&!editStyleText">编辑</span>
            <el-button class="btn" size="mini"  @click="submit" type="danger" round v-show="editing&&editStyleText">提交</el-button>
            <el-button class="btn" size="mini" @click="editStyleText = !editStyleText" round v-show="editing&&editStyleText">取消</el-button>
        </div>
        <article v-show="tab == 'status'" v-for="(item) in statusList" :key="item.sid">
            <status-card :item="item"></status-card>
        </article>
        <article v-show="tab == 'commodity-status'" v-for="(item) in commodityList" :key="item.sid">
            <commodity-card :item="item"></commodity-card>
        </article>
    </div>
</template>
<script>
import {updateAccountImg,updateAccountInfo,getUserInfo,getUserStatus,getUserCommodityStatus} from '../api/communication';
import CommodityCard from './CommodityCard.vue';
import StatusCard from './StatusCard.vue';
export default {
    components:{CommodityCard,StatusCard},
    data() {
        return{
            uid: '',
            styleText: '',
            editInfostyleText: '',
            editing: false,
            editStyleText: false,
            editingInfo: true,
            tab: 'info',
            tabNames: ['info','status','commodity-status'],
            statusList: [],
            commodityList: []
        }
    },
    computed:{
        imgSrc(){
            return this.$store.getters.uImgSrc
        }
    },
    created(){
        this.uid = window.localStorage.getItem('uid');
        getUserInfo({uid: this.uid}).then(res=>{
            this.styleText = res.data.info.styleText;
        })
    },
    mounted(){
        this.initTabClick();
    },
    methods:{
        initTabClick(){
            let tabs = document.getElementById('tabs').getElementsByClassName('tab');
            for(let i = 0; i < tabs.length; i++){
                 tabs[i].onclick = ()=>{
                    for (let j = 0; j < tabs.length; j++) {
                        if(tabs[j].classList.value.includes('active')){
                            tabs[j].classList.remove('active')
                        }
                    }
                    tabs[i].classList.add('active');
                    this.tab = this.tabNames[i];
                    if(i == 0){
                        this.editingInfo = true;
                    }else if(i == 1){
                        this.editingInfo = false;
                        this.updateStatus();
                    }else{
                        this.editingInfo = false;
                        this.updateCommodityList();
                    }
                }
            }
        },
        updateStatus(){
            getUserStatus({
                uid: this.uid
            }).then(res=>{
                this.statusList = res.data;
            })
        },
        updateCommodityList(){
            getUserCommodityStatus({
                uid: this.uid
            }).then(res=>{
                console.log();
                this.commodityList = res.data;
            })
        },
        handleAvatarSuccess(res,file){
            console.log('file',file);
            updateAccountImg({
                uid: this.uid,
                uImageSrc: res.imgName
            }).then(res=>{
                this.$store.dispatch('setUImgSrc',res.data.info.uImageSrc);
                this.$refs.upload.clearFiles();
            })
        },
        edit(){
            this.editStyleText = !this.editStyleText;
            this.editInfostyleText = this.styleText;
        },
        submit(){
            updateAccountInfo({
                uid: this.uid,
                updatePropKey: 'styleText',
                updatePropValue: this.editInfostyleText
            }).then(res=>{
                this.$message({
                    message: "提交成功",
                    type: "success"
                })
                this.styleText = res.data.info.styleText;
                this.$store.dispatch('setUStyleText',this.styleText)
                this.editStyleText = !this.editStyleText;
            })
        }
    }
}
</script>
<style lang="scss" scoped>
#container{
    #tabs{
        .tab{
            display: inline-block;
            border-bottom: 1px solid #000;
            font-size: 18px;
            font-weight: 500;
            color: rgb(128, 122, 122);
            margin: 0 10px 10px 0;
            &:hover{
                background: #ccc;
                cursor: pointer;
            }
        }
        .active{
            color: #000;
            background: #ccc;
        }
    }
    .title-p{
        display: inline-block;
        border-bottom: 1px solid #000;
        font-size: 18px;
        font-weight: 500;
        color: rgb(128, 122, 122);
        margin-bottom: 10px;
    }
    .info{
        display: flex;
        position: relative;
        .info-id{
            display: inline-block;
            height: 70px;
            line-height: 70px;
            font-weight: 500;
            font-size: 20px;
        }
        .info-btn{
            position: absolute;
            right: 10px;
            height: 30px;
            top: 5px;
        }
    }
    .edit-container{
        display: flex;
        .label{
            margin-right: 5px;
        }
        .content{
            // cursor: pointer;
        }
        .input-class{
            width: 400px;
            margin-right: 10px;
        }
        .edit-text{
            font-size: 14px;
            line-height: 24px;
            color: #2cade0;
            margin-left: 10px;
            cursor: pointer;
            &:hover{
                color: #32c1fb;
            }
        }
        .btn{
            height: 30px;
            margin-top: 20px;
        }
        .edit-btn{
            // width: 50px;
            height: 30px;
            margin-top: 12px;
            margin-left: 5px;
        }
    }
    article {
        width: 100%;
        background: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        margin-bottom: 20px;
        font-size: 19px;
        line-height: 1.6em;
        padding: 10px;
        .add-btn{
            position: absolute;
            right: 0;
        }
        .status-avatar{
            cursor: pointer;
        }
        .status-info{
            font-size: 12px;
            height: 20px;
            line-height: 20px;
            background-color: #eee;
            border-radius: 5px;
            margin: 0px 10px;
            padding: 5px;
            vertical-align: text-top;
        }
        p{
            padding: 10px;
        }
        .commodity-img{
            width: 200px;
            margin: 10px;
        }
    }
}
</style>