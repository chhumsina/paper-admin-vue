<template>
  <div class="page-view">
    <el-card class="the-card" v-loading="isLoading">
      <div slot="header" class="header-inner">
        <span class="title">标签列表</span>
        <el-button class="the-button" type="primary" size="small" @click="handleCreateTag">新建标签</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="220">
        </el-table-column>
        <el-table-column
          prop="name"
          label="标签名"
          show-overflow-tooltip
          min-width="180">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.name.length % 5 === 0">{{ scope.row.name }}</el-tag>
            <el-tag size="small" v-if="scope.row.name.length % 5 === 1" type="success">{{ scope.row.name }}</el-tag>
            <el-tag size="small" v-if="scope.row.name.length % 5 === 2" type="info">{{ scope.row.name }}</el-tag>
            <el-tag size="small" v-if="scope.row.name.length % 5 === 3" type="warning">{{ scope.row.name }}</el-tag>
            <el-tag size="small" v-if="scope.row.name.length % 5 === 4" type="danger">{{ scope.row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          show-overflow-tooltip
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="count"
          label="文章数">
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
          prop="address"
          width="100"
          fixed="right"
          label="操作">
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
      <div class="tip">最多可以添加 <span class="num total">{{ max }}</span> 个标签，已添加了 <span class="num count">{{ count }}</span> 个，最多还能添加 <span class="num last">{{ last }}</span> 个。</div>
    </el-card>
  </div>
</template>
<script>
const MAX = 30;
export default {
  name: 'Login',
  data () {
    return {
      isLoading: false,
      tableData: []
    };
  },
  computed: {
    max () {
      return MAX;
    },
    count () {
      return this.tableData.length;
    },
    last () {
      return this.max - this.tableData.length;
    }
  },
  mounted () {
    this.fetchTagList();
  },
  methods: {
    fetchTagList () {
      const API = CONFIG.API.CATEGORY_LIST;
      this.isLoading = true;
      $http.get(API)
        .then(res => {
          this.isLoading = false;
          this.tableData = res.data.list;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error(err.message || '系统故障');
          throw err;
        });
    },
    handleEditArticle (row) {
      this.$router.push({
        path: '/edit-tag',
        query: {
          id: row.id
        }
      });
    },
    handleDeleteArticle (row) {
      const API = CONFIG.API.DELETE_CATEGORY;
      const data = {
        id: row.id
      };
      this.isLoading = true;
      $http.post(API, data)
        .then(res => {
          this.isLoading = false;
          this.fetchTagList();
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error(err.message || '系统故障');
          throw err;
        });
    },
    handleCreateTag () {
      this.$router.push({
        name: 'CreateTag'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page-view {
  .tip {
    font-size: 14px;
    line-height: 1.5;
    margin-top: 10px;
    .num {
      font-weight: bold;
    }
    .total {
      color: #409EFF;
    }
    .count {
      color: #E6A23C;
    }
    .last {
      color: #F56C6C;
    }
  }
}
</style>
