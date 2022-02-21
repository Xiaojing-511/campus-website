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
                action="http://localhost:3000/add"
                list-type="picture-card"
                ref="upload"
                :on-success="handleAvatarSuccess"
                multiple
                :auto-upload="false">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                <img
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
    <article>
        <!-- <img src="http://localhost:3000/upload/1645433748197picture3.jpg" alt=""> -->
        <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderi
        </p>
    </article>
</div>
</template>
<script>
import {createUserCommodityStatus} from '../api/communication'
export default {
    data(){
        return {
            uid: '',
            dialogVisible: false,
            publishContent: '',
            // dialogImageUrl:'',
            // imgDialogVisible: false,
        }
    },
    mounted(){
        this.uid = window.localStorage.getItem('uid');
        console.log(this.uid);
    },
    methods: {
        handleRemove(file) {
            console.log(file);
        },
        submitForm(){
            this.$refs.upload.submit();
            console.log('submit...');
        },
        handleAvatarSuccess(res, file){
            console.log('upload',res,file);
            let commodityStatusInfo = {
                uid: this.uid,
                type: 'book',
                contents: this.publishContent,
                image: res.imgName
            }
            createUserCommodityStatus(commodityStatusInfo).then(resData=>{
                console.log(resData);
            })
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
    height: 400px;
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
    p{
        padding: 10px;
    }
}
</style>