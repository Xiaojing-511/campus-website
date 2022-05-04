<template>
<div>
    <el-dialog
        title="发布动态"
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
                action="/api/addStatusPhoto"
                list-type="picture-card"
                ref="upload"
                name="filestatus"
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
    <div id="new-state">
        <el-button class="new-btn" size="mini" type="primary" round @click="dialogVisible = !dialogVisible">发条动态</el-button>
        <div class="type-box">
            <el-tag
                class="type-tag"
                @click="selectTagClick(item,index)"
                v-for="(item,index) in allTypeTags"
                :key="item.label"
                :type="item.type"
                effect="plain">
                {{ item.label }}
            </el-tag>
        </div>
    </div>
    <article v-for="(item) in statusList" :key="item.sid">
        <status-card :item="item" :utype="utype"></status-card>
    </article>
    <p v-if="!statusList.length" style="color: #aaa;font-size:14px">没有啦...做第一个发布者吧！</p>
    <p v-else style="color: #aaa;font-size:14px">到底啦...</p>
</div>
</template>
<script>
// import { judgeEmptyStr } from '@/api/common';
const notSelected = 'info',selected = '';
const fileTypes = ['image/png','image/jpeg','image/jpg'];
import StatusCard from './StatusCard.vue';
import { createUserStatus,getAllUserStatus,addUserStatusImg,getStatusTagTypes,getTypesStatus,getUserInfo } from '@/api/communication'
export default {
    components:{StatusCard},
    data() {
        return {
            uid: window.localStorage.getItem('uid'),
            utype: '',
            statusList: [],
            newText: '',
            isWriting: false,
            dialogVisible: false,
            publishContent: '',
            fileList: [],
            statusImageArr: [],
            sid: '',
            typeTags: [],
            allTypeTags:[],
            selectTag: '',
            selectCheckTags: [],

        }
    },
    async created(){
        await this.getStatusTypes();
        await this.getStatus();
        await this.getUserType();
    },
    mounted(){
    },
    methods:{
        async getStatusTypes(){
            await getStatusTagTypes().then(res=>{
                let types = [],allTypes = [];
                allTypes.push({type: selected,label:'全部'});
                res.data.forEach(item => {
                    types.push({
                        type: item == '其他' ? selected : notSelected,
                        label: item
                    })
                    allTypes.push({
                        type: notSelected,
                        label: item
                    });
                });
                this.typeTags = types;
                this.allTypeTags = allTypes;
                this.selectTag = '其他';
                this.selectCheckTags = ['全部'];
            }).catch(err=>console.log(err))
        },
        async getStatus(){
            if(this.selectCheckTags.includes('全部')){
                getAllUserStatus().then(res=>{
                    this.statusList = res.data;
                })
            }else{
                getTypesStatus({statusTypes: this.selectCheckTags}).then(res=>{
                    this.statusList = res.data;
                }).catch(err=>console.log(err))
            }
        },
        async getUserType(){
            getUserInfo({uid:this.uid}).then(res=>this.utype = res.data.info.utype)
        },
        handleRemove(file) {
            this.fileList = this.fileList.filter((item)=>{
                return item.uid !== file.uid
            });
        },
        handleChange(file) {
            if(!fileTypes.includes(file.raw.type)){
                this.$message({
                    type: 'warning',
                    message: '图片仅支持png、jpg及jpeg格式!'
                });
                this.fileList = [...this.fileList];
            }else if(!this.fileList.includes(file)){
                this.fileList.push(file);
            }
        },
        async submitForm(){
            let statusInfo = {
                uid: this.uid,
                type: this.selectTag,
                contents: this.publishContent,
                image: ''
            }
            await createUserStatus(statusInfo).then(resData=>{
                this.sid = resData.data.sid;
                if(this.fileList.length){
                    this.$refs.upload.submit();
                }else{
                    this.dialogVisible = false;
                    this.sid = this.publishContent = '';
                    this.$message.success('发布成功！');
                    this.getStatus();
                }
            }).catch(err=>console.log(err))
        },
        handleAvatarSuccess(res){
            this.statusImageArr.push(res.imgName);
            if(this.fileList.length == this.statusImageArr.length){
                console.log('statusImageArr', this.statusImageArr);
                 addUserStatusImg({
                    sid: this.sid,
                    imgName: this.statusImageArr
                }).then(res=>{
                    if(res.status == 200){
                        this.dialogVisible = false;
                        this.sid = this.publishContent = '';
                        this.$refs.upload.clearFiles();
                        this.fileList = [];
                        this.statusImageArr = [];
                        this.$message.success('发布成功！');
                        this.getStatus();
                    }
                }).catch(err=>console.log(err))
            }           
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
        },
        selectTagClick(item,index){
            if(item.type == notSelected){
                if(item.label === '全部'){
                    this.allTypeTags = this.allTypeTags.map(item=>{
                        item.type = notSelected;
                        return item;
                    })
                    this.$set(this.allTypeTags,0,{...item,type: selected});
                    this.selectCheckTags = ['全部'];
                }else{
                    if(this.selectCheckTags.includes('全部')){
                        this.allTypeTags = this.allTypeTags.map(item=>{
                            item.type = notSelected;
                            return item;
                        })
                        this.selectCheckTags.splice(this.selectCheckTags.indexOf('全部'),1);
                    }
                    this.$set(this.allTypeTags,index,{...item,type: selected});
                    this.selectCheckTags.push(item.label);
                }
            }else if(item.type == selected  && this.selectCheckTags.length > 1){
                this.allTypeTags = this.allTypeTags.map(itemTag=>{
                    if(itemTag.label === item.label){
                        itemTag.type = notSelected;
                    }
                    return itemTag;
                })
                this.selectCheckTags.splice(this.selectCheckTags.indexOf(item.label),1);
            }
            this.getStatus();
        }
    }
}
</script>
<style lang="scss" scoped>
.type-tag{
    margin-right: 10px;
    margin-bottom: 5px;
    cursor: pointer;
    &:hover{
        color: #32c1fb;
        border-color: #32c1fb;
    }
}
.dialog{
    .type{
        margin-top: 10px;
    }
}
#new-state{
    height: 90px;
    display: flex;
    margin-bottom: 10px;
    margin-top: -20px;
    position: relative;
    .type-box{
        position: absolute;
        bottom: 0;
    }
    .btn{
        height: 40px;
        margin: 7px 5px 0 10px;
    }
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
    margin-bottom: 20px;
    font-size: 19px;
    line-height: 1.6em;
    padding: 10px;
    
}
</style>