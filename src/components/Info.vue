<template>
    <div id="container">
        <div class="info">
            <div style="width:100px;height:120px;">
                <el-avatar :size="70" :src="imgSrc"></el-avatar>
                <el-upload
                    action="http://localhost:3000/add"
                    ref="upload"
                    :on-success="handleAvatarSuccess"
                    auto-upload
                    :limit="1"
                    >
                        <el-button size="small" type="primary">更换头像</el-button>
                </el-upload>
            </div>
            <strong class="info-id">{{uid}}</strong>
        </div>
    </div>
</template>
<script>
import {updateAccountInfo} from '../api/communication';
export default {
    data() {
        return{
            info:{
                styleText: ''
            },
            uid: ''
        }
    },
    computed:{
        imgSrc(){
            return this.$store.getters.uImgSrc
        }
    },
    created(){
        this.uid = window.localStorage.getItem('uid');
    },
    methods:{
        handleAvatarSuccess(res,file){
            console.log(res,file);
            updateAccountInfo({
                uid: this.uid,
                styleText: this.info.styleText,
                uImageSrc: res.imgName
            }).then(res=>{
                console.log(res);
                this.$store.dispatch('setUImgSrc',res.data.info.uImageSrc);
                this.$refs.upload.clearFiles();
            })
        }
    }
}
</script>
<style lang="scss" scoped>
#container{
    .info{
        display: flex;
        .info-id{
            display: inline-block;
            height: 70px;
            line-height: 70px;
            font-weight: 500;
            font-size: 20px;
            margin-left: 20px;
        }
    }
}
</style>