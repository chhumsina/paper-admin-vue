<template>
  <div class="home-view">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box the-card">
          <div class="count">
            <div class="value">{{ statistics.userCount | formatNumber }}</div>
            <div class="unit">人</div>
          </div>
          <div class="name">用户数</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box the-card">
          <div class="count">
            <div class="value">{{ statistics.articleCount | formatNumber }}</div>
            <div class="unit">篇</div>
          </div>
          <div class="name">文章数</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box the-card">
          <div class="count">
            <div class="value">{{ statistics.commentCount | formatNumber }}</div>
            <div class="unit">条</div>
          </div>
          <div class="name">留言数</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'index',
  data () {
    return {
      userCount: 106760000,
      articleCount: 1343434234,
      commentCount: 23324324234,
      statistics: {
        userCount: 0,
        articleCount: 0,
        commentCount: 0
      },
      pageLoading: false
    };
  },
  mounted () {
    this.fetchStatistics();
  },
  methods: {
    fetchStatistics () {
      this.pageLoading = true;
      const API = CONFIG.API.STATISTICS;
      $http.get(API)
        .then(res => {
          this.pageLoading = false;
          this.statistics = res.data;
        })
        .catch(err => {
          this.pageLoading = false;
          this.$message.error(err.message || '系统故障');
          throw err;
        });
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.home-view {
  .box {
    font-size: 12px;
    box-shadow: 0 0 10px #ececec;
    .count {
      display: flex;
      align-items: baseline;
      .value {
        font-size: 23px;
      }
    }
    .name {
      font-size: 14px;
      margin-top: 5px;
    }
  }
}
</style>
