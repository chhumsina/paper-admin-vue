<template>
  <div class="register-view">
    <div class="register-panel">
      <h2 class="panel-title">注册</h2>
      <el-form status-icon :model="form" size="small" :rules="rules" ref="form" label-width="100px" class="register-form">
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="form.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0">
          <el-button type="primary" @click="handleSubmit('form')" :loading="isRegistering">注册</el-button>
        </el-form-item>
        <el-form-item style="margin-bottom:0">
          <el-button style="float: right;" type="text" @click="$router.push({name: 'Login'})">已有账号？现在登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    const validConfirmPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 4, max: 18, message: '账号长度在 4 到 18 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 18, message: '密码长度在 4 到 18 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 4, max: 18, message: '密码长度在 4 到 18 个字符', trigger: 'blur' },
          { validator: validConfirmPassword, trigger: 'blur' }
        ]
      },
      form: {
        account: '',
        password: '',
        confirmPassword: ''
      },
      isRegistering: false
    };
  },
  methods: {
    handleRegister () {
      this.isRegistering = true;
      const API = CONFIG.API.REGISTER;
      const data = {
        ...this.form
      };
      $http.post(API, data)
        .then(res => {
          this.isRegistering = true;
          this.$message.success('注册成功');
          this.$router.push({
            name: 'Login'
          });
        })
        .catch(err => {
          this.isRegistering = true;
          throw err;
        });
    },
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleRegister();
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
.register-view {
  .register-panel {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    width: 420px;
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
