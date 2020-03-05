<template>
  <div class="home-view">
    <el-card class="article-list the-card" v-loading="isLoading">
      <div slot="header" class="header-inner">
        <span class="title">文章列表</span>
        <el-button class="the-button" type="primary" size="small" @click="handleCreateArticle" :loading="isCreatingArticle">新建文章</el-button>
      </div>
      <el-form label-width="80px" :model="form" label-position="left" @submit.native.prevent>
        <el-form-item label="搜索">
          <el-input placeholder="根据标题、分类、标签、描述搜索" v-model="form.searchField" @change="handleSearch"></el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border>
        <el-table-column
          prop="id"
          width="220"
          label="ID"
        >
        <span
          class="id"
          slot-scope="scope"
          @click="handleCopy(scope.row)"
        >
          {{ scope.row.id }}
        </span>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          min-width="280"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="private"
          label="公开"
        >
        <template slot-scope="scope">
          {{ scope.row.private ? '否' : '是' }}
        </template>
        </el-table-column>
        <el-table-column
          prop="draft"
          label="草稿"
        >
        <template slot-scope="scope">
          {{ scope.row.draft ? '是' : '否' }}
        </template>
        </el-table-column>
        <el-table-column
          prop="catagory"
          show-overflow-tooltip
          label="分类"
        >
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.category.length % 5 === 0">{{ scope.row.category }}</el-tag>
          <el-tag size="small" v-if="scope.row.category.length % 5 === 1" type="success">{{ scope.row.category }}</el-tag>
          <el-tag size="small" v-if="scope.row.category.length % 5 === 2" type="info">{{ scope.row.category }}</el-tag>
          <el-tag size="small" v-if="scope.row.category.length % 5 === 3" type="warning">{{ scope.row.category }}</el-tag>
          <el-tag size="small" v-if="scope.row.category.length % 5 === 4" type="danger">{{ scope.row.category }}</el-tag>
        </template>
        </el-table-column>
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="标签"
        >
        <template slot-scope="scope">
          <div class="tags">
            {{ scope.row.tags && scope.row.tags.join('、') }}
          </div>
        </template>
        </el-table-column>
        <el-table-column
          prop="description"
          show-overflow-tooltip
          label="描述">
        </el-table-column>
        <el-table-column
          width="200"
          prop="createdAt"
          label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | dayjs }}
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="updatedAt"
          label="上次更新">
          <template slot-scope="scope">
            {{ scope.row.updatedAt | timeago }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-link class="the-link" :underline="false" type="primary" @click="handleEditArticle(scope.row)">编辑</el-link>
            <el-popconfirm
              icon="el-icon-info"
              iconColor="red"
              title="确定删除吗？(不可恢复)"
              @onConfirm="handleDeleteArticle(scope.row)"
            >
              <el-link class="the-link" style="margin-left: 5px" slot="reference" :underline="false" type="danger">删除</el-link>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px;text-align:right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]"
        v-bind="pagination"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'index',
  data () {
    return {
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      form: {
        searchField: ''
      },
      tableData: [],
      fileList: [],
      isCreatingArticle: false,
      visible: false,
      isLoading: false
    };
  },
  mounted () {
    this.fetchArticleList();
  },
  methods: {
    handleCopy (row) {
      this.$copyText(row.id)
        .then(() => {
          this.$message.success('复制id成功');
        })
        .catch(() => {
          this.$message.error('复制失败');
        });
    },
    handleCreateArticle () {
      const API = CONFIG.API.CREATE_ARTICLE;
      const data = {};
      this.isCreatingArticle = true;
      $http.post(API, data)
        .then(res => {
          this.isCreatingArticle = false;
          this.$router.push({
            name: 'CreateArticle',
            query: {
              id: res.data.id
            }
          });
        })
        .catch(err => {
          this.isCreatingArticle = false;
          throw err;
        });
    },
    handleSizeChange (pageSize) {
      this.pagination.pageSize = pageSize;
      this.fetchArticleList();
    },
    handleCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage;
      this.fetchArticleList();
    },
    fetchArticleList () {
      this.isLoading = true;
      const API = CONFIG.API.ARTICLES;
      const { pageSize, currentPage } = this.pagination;
      const data = {
        pageSize,
        currentPage
      };
      $http.post(API, data)
        .then(res => {
          this.isLoading = false;
          const { list, total } = res.data;
          this.tableData = list;
          this.pagination.total = total;
        })
        .catch(err => {
          this.isLoading = false;
          throw err;
        });
    },
    handleSearch () {
      const API = CONFIG.API.SEARCH_ARTICLE;
      const { pageSize, currentPage } = this.pagination;
      this.isLoading = true;
      const data = {
        searchField: this.form.searchField,
        pageSize,
        currentPage
      };
      $http.post(API, data)
        .then(res => {
          this.isLoading = false;
          const { list, total } = res.data;
          this.tableData = list;
          this.pagination.total = total;
        })
        .catch(err => {
          this.isLoading = false;
          throw err;
        });
    },
    handleEditArticle (row) {
      this.$router.push({
        path: '/edit-article',
        query: {
          id: row.id
        }
      });
    },
    handleDeleteArticle (row) {
      const API = CONFIG.API.DELETE_ARTICLE;
      const data = {
        id: row.id
      };
      $http.post(API, data)
        .then(res => {
          this.$message.success('删除成功');
          this.fetchArticleList();
        });
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.home-view {}
</style>
