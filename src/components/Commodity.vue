<template>
<div>
    <el-dialog
        title="发布二手商品"
        :visible.sync="dialogVisible"
        width="55%"
    >
        <div class="dialog">
            <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="publishContent"
                :rows="4"
                maxlength="100"
                show-word-limit
            >
            </el-input>
            <el-upload
                action="http://localhost:3000/addCommodityPhoto"
                list-type="picture-card"
                ref="upload"
                name="filecommodity"
                accept="jpg, png, jpeg"
                :on-change="handleChange"
                :on-success="handleAvatarSuccess"
                :limit="6"
                multiple
                :file-list="fileList"
                :auto-upload="false">
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                        <img
                            name="file"
                            class="el-upload-list__item-thumbnail"
                            :src="file.url" alt=""
                        >
                        <span class="el-upload-list__item-actions">
                            <span
                                class="el-upload-list__item-delete"
                                @click="handleRemove(file)"
                            >
                            <i class="el-icon-delete"></i>
                            </span>
                        </span>
                    </div>
            </el-upload>
            <el-button type="primary" @click="submitForm()">立即发布</el-button>
        </div>
        
    </el-dialog>

    <div class="container">
        <el-button class="new-btn" size="mini" type="primary" round @click="showDialog()">我要发布</el-button>
    </div>
    <article v-for="(item) in commodityList" :key="item.cid">
        <span>
            <el-avatar class="el-dropdown-link status-avatar" :src="item.uImageSrc"></el-avatar>
        </span>
        <span class="status-info" >{{item.uid}}</span>
        <span class="status-info">{{item.createTime}}</span>
        <p>{{item.contents}}</p>
        <img class="commodity-img" v-for="(itemImg,index) in item.image" :key="index" :src="itemImg" alt=""/>
    </article>
</div>
</template>
<script>
import {
    createUserCommodityStatus,
addUserCommodityStatusImg,
// addCommodityPhoto,
getUserCommodityStatus} from '../api/communication'
export default {
    data(){
        return {
            uid: '',
            dialogVisible: false,
            publishContent: '',
            cid: '',
            commodityList: [],
            fileList: [],
            commodityImageArr:[],
            // dialogImageUrl:'',
            // imgDialogVisible: false,
        }
    },
    created(){
        this.updateCommodityList();
    },
    mounted(){
        this.uid = window.localStorage.getItem('uid');
    },
    methods: {
        updateCommodityList(){
            getUserCommodityStatus().then(res=>{
                this.commodityList = res.data;
            })
        },
        handleRemove(file) {
            console.log(file,this.fileList);
        },
        // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
        handleChange(file, fileList) {
            this.fileList = fileList;
        },
        async submitForm(){
            let commodityStatusInfo = {
                uid: this.uid,
                type: 'book',
                contents: this.publishContent,
                image: ''
            }
            await createUserCommodityStatus(commodityStatusInfo).then(resData=>{
                this.cid = resData.data.cid;
                this.$refs.upload.submit();
            })
        },
        handleAvatarSuccess(res){
            this.commodityImageArr.push(res.imgName);
            if(this.fileList.length == this.commodityImageArr.length){
                 addUserCommodityStatusImg({
                    cid: this.cid,
                    imgName: this.commodityImageArr
                }).then(res=>{
                    if(res.status == 200){
                        this.dialogVisible = false;
                        this.cid = this.publishContent = '';
                        this.$refs.upload.clearFiles();
                        this.fileList = [];
                        this.commodityImageArr = [];
                        this.$message.success('发布成功！');
                        this.updateCommodityList();
                    }
                }) 
            }
                      
        },
        // handlePictureCardPreview(file) {
        //     this.dialogImageUrl = file.url;
        //     this.imgDialogVisible = true;
        // },
        // handleDownload(file) {
        //     console.log(file);
        // },
        showDialog(){
            this.dialogVisible = !this.dialogVisible;
            // 问：取不到dialog内部dom
            // 解：dialog在初始的时候没有加载,自然调用不到,当dialog显示时,需要用到nextTick,使dom更新之后再调用。就可以调用到了
            // this.$nextTick(()=>{
            //     document.querySelector('#file').onchange = function (){
            //         if(this.files.length){
            //             let file = this.files[0];
            //             let reader = new FileReader();
            //             console.log('file',file);
            //             //新建 FileReader 对象
            //             reader.onload = function(){
            //                 // 当 FileReader 读取文件时候，读取的结果会放在 FileReader.result 属性中
            //                 document.querySelector('#img').src = this.result;
            //                 // document.querySelector('#text').innerHTML = this.result;
            //             };
            //             // 设置以什么方式读取文件，这里以base64方式
            //             reader.readAsDataURL(file);
            //         }
            //     }
            // })
            
        }
    }

}
</script>
<style>
.dialog .el-textarea__inner{
    border-color: transparent;
}
</style>
<style lang="scss" scoped>
.dialog{
    width: 100%;
    height: 500px;
    position: relative;
    margin-top: -10px;
}
.container{
    position: relative;
    height: 54px;
    margin-bottom: 10px;
    margin-top: -20px;
    .new-btn{
        height: 40px;
        position: absolute;
        top: 7px;
        right: 5px;
    }

}
article {
    width: 100%;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    // overflow: hidden;
    margin-bottom: 40px;
    font-size: 19px;
    line-height: 1.6em;
    padding: 10px;

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
</style>