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
            <div class="type">
                <span>分类：</span>
                <el-tag
                    class="type-tag"
                    @click="tagClick(item,index)"
                    v-for="(item,index) in typeTags"
                    :key="item.label"
                    :type="item.type"
                    effect="plain">
                    {{ item.label }}
                </el-tag>
            </div>
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
        <el-button class="new-btn" size="mini" type="primary" round @click="dialogVisible = !dialogVisible">我要发布</el-button>
    </div>
    <article v-for="(item) in commodityList" :key="item.cid">
        <commodity-card :item="item"></commodity-card>
    </article>
</div>
</template>
<script>
const notSelected = 'info',selected = '';
import {
    createUserCommodityStatus,
    addUserCommodityStatusImg,
    getAllUserCommodityStatus,
    getCommodityTagTypes,
} from '../api/communication'
import CommodityCard from './CommodityCard.vue';
export default {
    components:{CommodityCard},
    data(){
        return {
            uid: window.localStorage.getItem('uid'),
            dialogVisible: false,
            publishContent: '',
            cid: '',
            commodityList: [],
            fileList: [],
            commodityImageArr:[],
            typeTags:[],
            selectTag: ''
        }
    },
    created(){
        this.updateCommodityList();
        this.getTagTypes();
    },
    methods: {
        updateCommodityList(){
            getAllUserCommodityStatus().then(res=>{
                this.commodityList = res.data;
            })
        },
        handleRemove(file) {
            this.fileList = this.fileList.filter((item)=>{
                return item.uid !== file.uid
            });
        },
        // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
        handleChange(file, fileList) {
            this.fileList = fileList;
        },
        async submitForm(){
            let commodityStatusInfo = {
                uid: this.uid,
                type: this.selectTag,
                contents: this.publishContent,
                image: ''
            }
            await createUserCommodityStatus(commodityStatusInfo).then(resData=>{
                this.cid = resData.data.cid;
                if(this.fileList.length){
                    this.$refs.upload.submit();
                }else{
                    this.dialogVisible = false;
                    this.cid = this.publishContent = '';
                    this.$message.success('发布成功！');
                    this.updateCommodityList();
                }
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
        getTagTypes(){
            getCommodityTagTypes().then(res=>{
                let types = [];
                res.data.forEach(item => {
                    types.push({
                        type: item == '其他' ? selected : notSelected,
                        label: item
                    })
                });
                this.typeTags = types;
                this.selectTag = '其他';
            })
        },
        tagClick(item,index){
            if(item.type == notSelected){
                this.typeTags = this.typeTags.map((item)=>{
                    item.type = notSelected;
                    return item;
                })
                this.$set(this.typeTags,index,{...item,type: selected});
                this.selectTag = item.label;
            }
        }  
    }

}
</script>
<style>
.dialog .el-textarea__inner{
    border-color: transparent;
}
.dialog .el-upload{
    margin: 10px 0;
}
</style>
<style lang="scss" scoped>
.dialog{
    width: 100%;
    height: 500px;
    position: relative;
    margin-top: -10px;
    .type{
        margin-top: 10px;
        .type-tag{
            margin-right: 10px;
            margin-bottom: 5px;
            cursor: pointer;
            &:hover{
                color: #32c1fb;
                border-color: #32c1fb;
            }
        }
    }
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
    margin-bottom: 40px;
    font-size: 19px;
    line-height: 1.6em;
    padding: 10px;
}

</style>