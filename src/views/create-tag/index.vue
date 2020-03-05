<template>
  <div class="page-view">
    <el-card class="the-card" v-loading="pageLoding">
      <div slot="header" class="header-inner">
        <span class="title">创建标签</span>
      </div>
      <el-form :model="category" :rules="rules" label-width="100px" size="small">
        <el-form-item label="标签名" prop="name">
          <el-input v-model="category.name" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" maxlength="500" v-model="category.description" :autosize="{ minRows: 2, maxRows: 10}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="isEdit" :loading="isLoading" @click="handleSaveCategory">保存</el-button>
          <el-button type="primary" v-else :loading="isLoading" @click="handleCreateCategory">新建标签</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      category: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '标签名不能为空' }
        ]
      },
      isLoading: false,
      pageLoding: false
    };
  },
  computed: {
    isEdit () {
      return this.$route.path === '/edit-tag';
    },
    breadcrumb () {
      return [
        {
          text: '标签管理',
          to: {
            name: 'Tag'
          }
        },
        {
          text: this.isEdit ? '编辑标签' : '创建标签'
        }
      ];
    },
    categoryId () {
      return this.$route.query.id;
    }
  },
  mounted () {
    this.$store.commit('setBreadbrumb', this.breadcrumb);
    this.isEdit && this.fetchCategotyInfo();
  },
  methods: {
    fetchCategotyInfo () {
      const API = CONFIG.API.CATEGORY_DETAIL;
      const data = {
        id: this.categoryId
      };
      this.pageLoding = true;
      $http.post(API, data)
        .then(res => {
          const { name, description } = res.data;
          this.category = {
            name,
            description
          };
          this.pageLoding = false;
        })
        .catch(err => {
          this.pageLoding = false;
          this.$message.error(err.message || '系统故障');
          throw err;
        });
    },
    handleSaveCategory () {
      const API = CONFIG.API.EDIT_CATEGORY;
      const data = {
        id: this.categoryId,
        ...this.category
      };
      this.isLoading = true;
      $http.post(API, data)
        .then(res => {
          this.$message.success('修改成功');
          this.$router.push({
            name: 'Tag'
          });
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error(err.message || '系统故障');
          throw err;
        });
    },
    handleCreateCategory () {
      const API = CONFIG.API.CREATE_CATEGORY;
      const data = {
        ...this.category
      };
      this.isLoading = false;
      $http.post(API, data)
        .then(res => {
          this.$message.success('创建成功');
          this.$router.push({
            name: 'Tag'
          });
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error(err.message || '系统故障');
          throw err;
        });
    }
  },
  beforeDestroy () {
    this.$store.commit('setBreadbrumb', []);
  }
};
</script>
<style lang="scss" scoped>
.page-view {}
</style>
