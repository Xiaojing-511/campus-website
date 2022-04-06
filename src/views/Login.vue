<template>
  <div id="container">
    <el-form v-if="type === 'login'" :model="loginForm" :rules="loginRules" ref="loginForm" label-width="100px">
      <el-form-item label="账号" prop="id">
        <el-input v-model="loginForm.id" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass" >
        <el-input v-model="loginForm.pass" clearable type="password"></el-input>
      </el-form-item>
    </el-form>
    <el-form v-if="type === 'register'" :model="registerForm" :rules="rules" ref="registerForm" label-width="100px">
      <el-form-item label="账号" prop="id">
        <el-input v-model="registerForm.id" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass" >
        <el-input v-model="registerForm.pass" type="password" clearable></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass" >
        <el-input v-model="registerForm.checkPass" type="password" clearable></el-input>
      </el-form-item>
      <el-form-item label="学院" prop="academy">
        <el-select v-model="registerForm.academy" placeholder="请选择所在学院">
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
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-input v-model="registerForm.major" clearable></el-input>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-select v-model="registerForm.grade" placeholder="请选择年级">
          <el-option label="2015" value="2015"></el-option>
          <el-option label="2016" value="2016"></el-option>
          <el-option label="2017" value="2017"></el-option>
          <el-option label="2018" value="2018"></el-option>
          <el-option label="2019" value="2019"></el-option>
          <el-option label="2020" value="2020"></el-option>
          <el-option label="2021" value="2021"></el-option>
          <el-option label="2022" value="2022"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="个性签名" prop="styleText">
        <el-input v-model="registerForm.styleText" clearable></el-input>
      </el-form-item>
    </el-form>
    <p class="skip-text" v-show="type === 'login'" @click="changeType('register')">没有账号? 去注册</p>
    <p class="skip-text" v-show="type === 'register'" @click="changeType('login')">已有账号,去登陆</p>
    <el-button class="submit-btn" @click="register('registerForm')" v-show="type === 'register'" type="primary">注册</el-button>
    <el-button class="submit-btn" @click="login('loginForm')" v-show="type === 'login'" type="primary">登陆</el-button>
    <el-button class="reset-btn" @click="resetForm">重置</el-button>
  </div>
</template>
<script>
import { getUserLogin,createAccount,juageUserIdOnly } from "@/api/communication";
// import { judgeEmptyStr } from '@/api/common';
export default {
  data() {
    var validateId = (rule, value, callback) => {
      juageUserIdOnly({uid: value}).then(res=>{
        if(!res.data.isOnly){
          callback(new Error('账号重复,换个名字吧～'));
        }else{
          callback();
        }
      })
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.registerForm.checkPass !== '') {
          this.$refs.registerForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      type: 'login',
      loginForm:{
        id: '',
        pass: ''
      },
      registerForm: {
        id: '',
        pass: '',
        checkPass: '',
        academy: '',
        major: '',
        grade: '',
        styleText: ''
      },
      loginRules:{
        id: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' },
        ],
      },
      rules: {
        id: [
          { required: true, message: '请输入注册账号名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' },
          { validator: validateId, trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        academy: [
          { required: true, message: '请选择学院', trigger: 'blur' },
        ],
        major: [
          { required: true, message: '请填写专业名称', trigger: 'blur' },
        ],
        grade: [
          { required: true, message: '请选择年级', trigger: 'blur' },
        ],

      }
    };
  },
  methods: {
    login1(){
      console.log('login',this.loginForm);
    },
    register1(){ 
      console.log('login',this.registerForm);
    },
    // 切换状态
    changeType(type){
      this.type = type;
      let formName = this.type === 'login' ? 'registerForm' : 'loginForm';
      this.$refs[formName].resetFields();
    },
    // 注册新账号
    register(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            createAccount({
              uid: this.registerForm.id,
              upwd: this.registerForm.pass,
              styleText: this.registerForm.styleText,
              uacademy: this.registerForm.academy,
              umajor: this.registerForm.major,
              ugrade: this.registerForm.grade,
              uImageSrc: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            }).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: "注册账户成功，请再次尝试登陆！",
                  type: "success"
                });
                this.resetForm();
                this.type = 'login';
              } else {
                this.$message({
                  message: "注册账户失败，请重试！",
                  type: "error"
                });
                this.resetForm();
              }
            });
          } else {
            return false;
          }
        });
    },
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          getUserLogin({
            uid: this.loginForm.id,
            upwd: this.loginForm.pass
          }).then(res => {
            if (res.data.pwdIsTrue) {
              window.localStorage.setItem('uid',this.loginForm.id)
              this.$store.dispatch("setUid", this.loginForm.id);
              this.$router.push(`/main/status`);
            } else {
              this.$message({
                message: "密码错误，请重试！",
                type: "error"
            });
            this.resetForm();
            }
          });
        } else {
          return false;
        }
      })
    },
    resetForm() {
      let formName = this.type === 'register' ? 'registerForm' : 'loginForm';
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
#container{
  width: 300px;
  margin: 70px auto 0;
  transform: translateX(-10%);
  position: relative;
  .c-input {
    width: 150px;
    margin: 10px 0;
  }
  .skip-text{
    width: 100px;
    position: absolute;
    right: -10px;
    bottom: -25px;
    font-size: 12px;
    &:hover{
      color: blue;
      cursor: pointer;
    }
  }
  .submit-btn{
    position: absolute;
    bottom: -70px;
    left: 50%;
    transform: translateX(-50%);
  }
  .reset-btn{
    position: absolute;
    bottom: -70px;
    left: 65%;
  }

}
</style>