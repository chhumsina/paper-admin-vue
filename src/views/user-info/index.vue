<template>
  <div class="user-info-view">
    <el-card class="the-card">
      <div class="header" slot="header">
        <div class="header-inner">个人信息</div>
      </div>
      <div class="body">
        <el-upload
          class="upload-avatar"
          action=""
          :show-file-list="false"
          :http-request="handleCustomerUpload"
          :multiple="false">
            <el-avatar slot="trigger" :size="60" :src="form.avatar"></el-avatar>
            <span class="tip">修改</span>
        </el-upload>
        <el-form ref="form" :model="form" label-width="100px" :rules="rules" class="form" size="small">
          <el-form-item label="ID">
            <span class="id">{{ form.id }}</span>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input maxlength="20" v-model="form.nickname"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
             <el-radio-group v-model="form.gender">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
                <el-radio label="3">其他</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker
              style="width:100%"
              v-model="form.birthday"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="地区">
            <el-input maxlength="200" v-model="form.region"></el-input>
          </el-form-item>
          <el-form-item label="微信号">
            <el-input v-model="form.wechat" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="个人网站" prop="site">
            <el-input v-model="form.site"></el-input>
          </el-form-item>
          <el-form-item label="GitHub" prop="github">
            <el-input v-model="form.github"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave" :loading="isSaveing">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'UserInfo',
  data () {
    return {
      form: {
        avatar: '',
        nickname: '',
        gender: '',
        birthday: '',
        region: '',
        email: '',
        wechat: '',
        site: '',
        github: ''
      },
      isSaveing: false,
      rules: {
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        site: [
          { type: 'url', message: '请输入正确的网址', trigger: 'blur' }
        ],
        github: [
          { type: 'url', message: '请输入正确的网址', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    this.initUserInfo();
  },
  methods: {
    initUserInfo () {
      this.form = {
        ...this.$store.state.userInfo
      };
      console.log(this.form);
    },
    handleSave () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const API = CONFIG.API.EDIT_USERINFO;
          const data = {
            ...this.form
          };
          this.isSaveing = true;
          $http.post(API, data)
            .then(res => {
              this.isSaveing = false;
              this.$message.success('保存成功');
              this.$store.dispatch('fetchUserInfo');
            })
            .catch(err => {
              this.isSaveing = false;
              throw err;
            });
        } else {
          return false;
        }
      });
    },
    handleCustomerUpload ({ file }) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.form.avatar = e.target.result;
      };
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.user-info-view {
  .body {
    display: flex;
    align-items: flex-start;
    .upload-avatar {
      position: relative;
      overflow: hidden;
      border-radius: 50%;
      font-size: 0;
      &:hover {
        .tip {
          opacity: 1;
        }
      }
      .tip {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 100%;
        text-align: center;
        transform: translateX(-50%);
        font-size: 12px;
        line-height: 1.5;
        background: #F56C6C;
        color: var(--color-white);
        cursor: pointer;
        opacity: 0;
        transition: opacity .15s;
      }
    }
  }
  .form {
    flex: 1;
  }
}
</style>
