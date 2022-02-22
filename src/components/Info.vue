<template>
    <div id="container">
        <div class="info">
            <div style="width:100px;height:120px;">
                <el-avatar :size="70" :src="imgSrc" style="margin-left:5px"></el-avatar>
                <el-upload
                    action="http://localhost:3000/add"
                    ref="upload"
                    :on-success="handleAvatarSuccess"
                    auto-upload
                    :limit="1"
                    >
                        <el-button v-show="editing" size="small" type="primary">更换头像</el-button>
                </el-upload>
            </div>
            <strong class="info-id">{{uid}}</strong>
            <el-button @click="editInfo" class="info-btn" size="small" round>编辑资料</el-button>
        </div>
        <div class="edit-container">
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
            <el-button class="btn" size="mini" @click="cancel" round v-show="editing&&editStyleText">取消</el-button>
        </div>
    </div>
</template>
<script>
import {updateAccountImg,updateAccountInfo,getUserInfo} from '../api/communication';
export default {
    data() {
        return{
            uid: '',
            styleText: '',
            editInfostyleText: '',
            editing: false,
            editStyleText: false
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
    methods:{
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
        // 编辑个人信息
        editInfo(){
            this.editing = !this.editing;
        },
        edit(){
            this.editStyleText = !this.editStyleText;
            this.editInfostyleText = this.styleText;
        },
        cancel(){
            this.editStyleText = !this.editStyleText;
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
}
</style>