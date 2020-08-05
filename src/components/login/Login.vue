<template>
  <div class="login_item">
    <div class="login_title">
      <h1>富婆街管理系统</h1>
    </div>
    <div class="login_form">
      <h3>系统登录</h3>
      <el-form ref="ruleForm" :model="loginForm" class="login-page" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i class="el-icon-user" slot="prefix"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input show-password v-model="loginForm.password">
            <i class="el-icon-suitcase-1" slot="prefix"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="form_button">
          <el-button type="primary" @click="loginform">登录</el-button>
          <el-button type="info" @click="resetform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        // username: [
        //   { message: "请输入用户名", trigger: "blur" },
        //   { min: 2, max: 4, message: "长度在 3 到 5 个字符", trigger: "blur" }
        // ],
        // password: [
        //   { message: "请输入正确的密码", trigger: "blur" },
        //   { min: 6, max: 11, message: "密码长度6-11位", trigger: "blur" }
        // ]
      },
    };
  },
  methods: {
    loginform() {
      this.$refs.ruleForm.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        //通过axios发送的网络请求开始得到的result是promise对象，需要通过async和await转化为正常的对象
        const result = await this.$http.post("login", this.loginForm); //通过main.js中定义的$http，发送axios网络请求得到数据
        const resdata = result.data;
        if (resdata.meta.status == 200) {
          this.$message.success("登录成功");
        } else {
          this.$message.error("登录失败");
        }
        // console.log(resdata);
        //1、第一次登录的时候，前端调后端的登陆接口，发送用户名和密码
        // 2、后端收到请求，验证用户名和密码，验证成功，就给前端返回一个token
        // 3、前端拿到token，将token存储到sessionStorage和vuex中，并跳转路由页面
        // 4、前端每次跳转路由，就判断 sessionStroage 中有无 token ，没有就跳转到登录页面，有则跳转到对应路由页面
        // 5、每次调后端接口，都要在请求头中加token
        // 6、后端判断请求头中有无token，有token，就拿到token并验证token，验证成功就返回数据，验证失败（例如：token过期）就返回401，请求头中没有token也返回401
        // 7、如果前端拿到状态码为401，就清除token信息并跳转到登录页面
        window.sessionStorage.setItem("token", resdata.data.token);
        this.$router.push("/home");
      });
    },

    //重置数据方法，resetFields是element重置表单的方法
    resetform() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style scoped>
.login_item {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-image: url("../../assets/images/login/loginbg.jpg");
  background-size: cover;
  overflow: hidden;
}
.login_form {
  width: 500px;
  height: 300px;
  display: block;
  margin: 0 auto;
  position: relative;
  top: 50%;
  background-color: white;
  margin-top: -250px;
  border-radius: 5px;
  z-index: 999;
}
.login-page {
  position: relative;
  border-radius: 5px;
  margin: 10px auto;
  width: 400px;
  padding: 10px 15px 5px;
  background: #fff;
  border: 1px solid #eaeaea;
}
.login_form h3 {
  color: black;
  margin-left: 50px;
  padding-top: 50px;
}
.login_title {
  position: relative;
  top: 18%;
  margin-top: -150px;
  display: block;
  margin: 0 auto;
}
.login_title h1 {
  color: #fff;
  text-align: center;
  letter-spacing: 2px;
}
.form_button {
  display: flex;
  flex-flow: row-reverse;
}
</style>