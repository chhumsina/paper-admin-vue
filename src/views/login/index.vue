<template>
  <div class="login-view">
    <div class="login-panel">
      <h2 class="panel-title">登录</h2>
      <el-form status-icon :model="form" size="small" :rules="rules" ref="form" label-width="60px" class="login-form">
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" @keyup.enter.native="handleSubmit('form')" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('form')" :loading="isLogining">登录</el-button>
        </el-form-item>
        <el-form-item style="margin-bottom:0">
          <el-button style="float: right;" type="text" @click="$router.push({name: 'Register'})">没有账号？现在注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 4, max: 18, message: '长度在 4 到 18 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 18, message: '长度在 4 到 18 个字符', trigger: 'blur' }
        ]
      },
      form: {
        account: '',
        password: ''
      },
      isLogining: false
    };
  },
  methods: {
    handleLogin () {
      this.isLogining = true;
      const API = CONFIG.API.LOGIN;
      const data = {
        ...this.form
      };
      $http.post(API, data)
        .then(res => {
          this.isLogining = false;
          localStorage.setItem('token', res.data.token);
          const redirectUrl = localStorage.getItem('redirectUrl');
          if (redirectUrl) {
            localStorage.removeItem('redirectUrl');
            this.$router.replace({
              path: redirectUrl
            });
          } else {
            this.$router.push({
              name: 'Home'
            });
          }
        })
        .catch(err => {
          this.isLogining = false;
          throw err;
        });
    },
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleLogin();
        } else {
          return false;
        }
      });
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.login-view {
  .login-panel {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    width: 400px;
    padding: 20px 40px 20px 20px;
    box-sizing: border-box;
    background: var(--color-white);
    box-shadow: 0 0 10px #eee;
    .panel-title {
      margin: 0;
      font-size: 18px;
      line-height: 40px;
      font-weight: normal;
      text-align: center;
    }
  }
}
</style>
