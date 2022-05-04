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
            <el-button @click="editInfo" v-show="editingInfo" class="info-btn" size="small" round>编辑资料</el-button>
        </div>
        <div id="tabs">
            <li class="tab active">基本信息</li>
            <li class="tab">我的动态</li>
            <li class="tab">我的二手商品动态</li>
        </div>
        <div class="edit-container" v-show="tab == 'info'">
            <el-dialog
                title="提示"
                :visible.sync="changeInfoDialogVisible"
                width="30%"
                center>
                <span>确认修改以上信息吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="changeInfoDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </span>
            </el-dialog>  
            <div class="info-box">
                <span class="label">学院:</span>
                <span class="content" v-show="!editing">{{this.info.uacademy}}</span>
                <el-select v-model="changeInfo.uacademy" placeholder="请选择所在学院" v-show="editing">
                    <el-option label="电子工程学院" value="电子工程学院"></el-option>
                    <el-option label="东语学院" value="东语学院"></el-option>
                    <el-option label="俄语学院" value="俄语学院"></el-option>
                    <el-option label="法学院" value="法学院"></el-option>
                    <el-option label="化学化工与材料学院" value="化学化工与材料学院"></el-option>
                    <el-option label="计算机科学技术学院" value="计算机科学技术学院"></el-option>
                    <el-option label="软件学院" value="软件学院"></el-option>
                    <el-option label="机电工程学院" value="机电工程学院"></el-option>
                    <el-option label="建筑工程学院" value="建筑工程学院"></el-option>
                    <el-option label="教育科学研究院" value="教育科学研究院"></el-option>
                    <el-option label="经济与工商管理学院" value="经济与工商管理学院"></el-option>
                    <el-option label="历史文化旅游学院" value="历史文化旅游学院"></el-option>
                    <el-option label="生命科学学院" value="生命科学学院"></el-option>
                    <el-option label="数据科学与技术学院" value="数据科学与技术学院"></el-option>
                    <el-option label="研究生院" value="研究生院"></el-option>
                </el-select>
            </div>
            <div class="info-box">
                <span class="label">专业:</span>
                <span class="content" v-show="!editing">{{this.info.umajor}}</span>
                <el-input
                    type="textarea"
                    :rows="1"
                    placeholder="请输入内容"
                    v-model="changeInfo.umajor"
                    class="input-class"
                    maxlength="30"
                    show-word-limit
                    v-show="editing"
                >
                </el-input>
            </div>
            <div class="info-box">
                <span class="label">年级:</span>
                <span class="content" v-show="!editing">{{this.info.ugrade}}</span>
                <el-select v-model="changeInfo.ugrade" placeholder="请选择年级" v-show="editing">
                    <el-option label="2015" value="2015"></el-option>
                    <el-option label="2016" value="2016"></el-option>
                    <el-option label="2017" value="2017"></el-option>
                    <el-option label="2018" value="2018"></el-option>
                    <el-option label="2019" value="2019"></el-option>
                    <el-option label="2020" value="2020"></el-option>
                    <el-option label="2021" value="2021"></el-option>
                    <el-option label="2022" value="2022"></el-option>
                </el-select>
            </div>
             <div class="info-box">
                <span class="label">个性签名:</span>
                <span class="content" v-show="!editing">{{this.info.styleText}}</span>
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="changeInfo.styleText"
                    class="input-class"
                    maxlength="30"
                    show-word-limit
                    v-show="editing"
                >
                </el-input>
            </div>

            <!-- <span class="edit-text" @click="edit" v-show="editing&&!editStyleText">编辑</span> -->
            <el-button class="btn" size="mini"  @click="changeInfoDialogVisible = true" type="primary" round v-show="editing">提交</el-button>
            <el-button class="btn" size="mini" @click="editing = !editing" round v-show="editing">取消</el-button>
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
            info: {},
            changeInfo:{
                uid: '',
                styleText: '',
                uacademy:'',
                umajor: '',
                ugrade: '',

            },
            editing: false,
            editingInfo: true,
            changeInfoDialogVisible: false,
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
            this.info = res.data.info;
            this.styleText = this.info.styleText;
        }).catch(err=>console.log(err));
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
            }).catch(err=>console.log(err));
        },
        updateCommodityList(){
            getUserCommodityStatus({
                uid: this.uid
            }).then(res=>{
                this.commodityList = res.data;
            }).catch(err=>console.log(err));
        },
        handleAvatarSuccess(res){
            updateAccountImg({
                uid: this.uid,
                uImageSrc: res.imgName
            }).then(res=>{
                this.$store.dispatch('setUImgSrc',res.data.info.uImageSrc);
                this.$refs.upload.clearFiles();
            }).catch(err=>console.log(err));
        },
        editInfo(){
            this.editing = !this.editing;
            this.editing ? this.changeInfo = {...this.info} : '';
        },
        submit(){
            this.changeInfoDialogVisible = false;
            let updateInfo = {};
            for(var key in this.changeInfo){
                if(this.changeInfo[key].trim().length || key === 'styleText'){
                    this.changeInfo[key] !== this.info[key] ? updateInfo[key] = this.changeInfo[key] : '';
                }else{
                    this.$message({
                        type: 'warning',
                        message: '填写不规范！注意除个性签名外均为必填项'
                    });
                    return;
                }
            }
            updateAccountInfo({
                uid: this.uid,
                updateKeyValues: updateInfo
            }).then(res=>{
                this.$message({
                    message: "提交成功",
                    type: "success"
                })
                this.info = {...res.data.info};
                this.changeInfo = {...res.data.info};
                this.styleText = this.info.styleText;
                this.$store.dispatch('setUStyleText',this.styleText);
                this.editing = !this.editing;
            }).catch(err=>console.log(err));
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
        margin-top: 10px;
        .info-box{
            margin-bottom: 20px;
        }
        .label{
            margin-right: 5px;
            color: #576C95;
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