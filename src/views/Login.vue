<template>
  <div id="container">
    <div>
      账号:
      <el-input
        id="student"
        class="c-input"
        v-model="userid"
        placeholder="请输入手机号登陆"
        label="手机号"
      ></el-input>
    </div>
    <div>
      密码:
      <el-input
        type="password"
        class="c-input"
        v-model="userpwd"
        placeholder="请输入密码..."
      ></el-input>
    </div>
    <p class="skip-text" v-show="type === 'register'" @click="changeType('login')">没有账号? 去注册</p>
    <p class="skip-text" v-show="type === 'login'" @click="changeType('register')">已有账号去登陆</p>
    <el-button class="btn" @click="register" v-show="type === 'login'" type="primary">注册</el-button>
    <el-button class="btn" @click="login" v-show="type === 'register'" type="primary">登陆</el-button>
  </div>
</template>
<script>
import { getUserLogin,createAccount } from "@/api/communication";
export default {
  data() {
    return {
      type: 'register',
      userid: "",
      userpwd: ""
    };
  },
  methods: {
    // 切换状态
    changeType(type){
      this.type = type;
      this.userid = this.userpwd = "";
    },
    // 注册新账号
    register(){
      if (!this.judgeEmptyStr(this.userid)&&!this.judgeEmptyStr(this.userpwd)) {
        createAccount({
          uid: this.userid,
          upwd: this.userpwd
        }).then(res => {
          if (res.status === 200) {
            this.$message({
              message: "注册账户成功，请再次尝试登陆！",
              type: "success"
            });
            this.type = 'register';
            this.userid = this.userpwd = "";
          } else {
            this.$message({
              message: "注册账户失败，请重试！",
              type: "error"
            });
            this.userid = this.userpwd = "";
          }
        });
      }else{
         this.$message({
              message: "账号或密码不能为空，请重试",
              type: "error"
            });
            this.userid = this.userpwd = "";
      }
    },
    judgeEmptyStr(strings){
      return strings.replace(/(^\s*)|(\s*$)/g, "").length == 0
    },
    login() {
      if (!this.judgeEmptyStr(this.userid)&&!this.judgeEmptyStr(this.userpwd)) {
        getUserLogin({
          uid: this.userid,
          upwd: this.userpwd
        }).then(res => {
          if (res.data.pwdIsTrue) {
            this.$store.dispatch("setUid", this.userid);
            this.$router.push(`/main/home`);
          } else {
            this.$message({
              message: "密码错误，请重试！",
              type: "error"
            });
            this.userid = this.userpwd = "";
          }
        });
      }else{
         this.$message({
              message: "账号或密码不能为空，请重试",
              type: "error"
            });
            this.userid = this.userpwd = "";
      }
      
    }
  }
};
</script>
<style lang="scss" scoped>
#container{
  width: 240px;
  height: 180px;
  margin: 100px auto 0;
  position: relative;
  .c-input {
    width: 150px;
    margin: 10px 0;
  }
  .skip-text{
    position: absolute;
    right: 0;
    font-size: 12px;
    &:hover{
      color: blue;
      cursor: pointer;
    }
  }
  .btn{
    position: absolute;
    bottom: 0;
    left: 120px;
    transform: translateX(-50%);
  }

}
</style>