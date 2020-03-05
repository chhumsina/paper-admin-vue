<template>
  <div class="common-layout-container">
    <div class="menu" :class="{'is-collapse': collapse}">
      <el-menu
        :router="menuConfig.router"
        :default-active="defaultActive"
        :collapse="collapse"
        class="menu-inner"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <template v-for="menuItem of menuConfig.items">
          <el-submenu :key="menuItem.index" :index="menuItem.index" v-if="menuItem.children && menuItem.children.length > 0">
            <template slot="title">
              <i :class="menuItem.icon"></i>
              <span>{{ menuItem.text }}</span>
            </template>
            <el-menu-item v-for="item of menuItem.children" :key="item.index" :index="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.text }}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item :key="menuItem.index" :index="menuItem.index" v-else>
            <i :class="menuItem.icon"></i>
            <span slot="title">{{ menuItem.text }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="right" :class="{'is-collapse': collapse}">
      <div class="header">
        <div class="header-left">
          <div class="toggle-menu" @click="collapse = !collapse">
            <span class="el-icon-s-unfold" v-if="collapse"></span>
            <span class="el-icon-s-fold" v-else></span>
          </div>
        </div>
        <div class="header-right">
          <span class="username" v-if="userInfo">{{ userInfo.nickname }}</span>
          <el-dropdown @command="handleCommand" trigger="click">
            <el-avatar :size="40" :src="userInfo.avatar"></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="exit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item v-for="(item, index) of breadcrumb" :key="index" :to="item.to">{{ item.text }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main">
        <router-view/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CommonLayout',
  data () {
    return {
      menuConfig: CONFIG.MENU,
      collapse: false,
      defaultActive: ''
    };
  },
  computed: {
    breadcrumb () {
      return this.$store.state.breadcrumb;
    },
    userInfo () {
      return this.$store.state.userInfo;
    }
  },
  mounted () {
    const { activeSrc } = this.$route.meta;
    this.defaultActive = activeSrc;
  },
  watch: {
    $route (newRoute) {
      const { activeSrc } = newRoute.meta;
      this.defaultActive = activeSrc;
    }
  },
  methods: {
    handleCommand (command) {
      switch (command) {
        case 'exit':
          this.$store.commit('handleExit');
      }
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.common-layout-container {
  .menu {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    overflow-y: auto;
    width: 200px;
    background: rgb(84, 92, 100);
    box-sizing: border-box;
    transition: width .3s;
    &.is-collapse {
      width: 64px;
    }
    .menu-inner {
      border: 0;
      width: 100% !important;
      transition: width .3s;
    }
  }
  .right {
    position: fixed;
    left: 200px;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: auto;
    transition: left .3s;
    &.is-collapse {
      left: 64px;
    }
    .header {
      display: flex;
      align-items: center;
      padding: 0 20px 0 15px;
      box-sizing: border-box;
      justify-content: space-between;
      height: 50px;
      background: var(--color-white);
      box-shadow: 0 0 10px #dedede;
      .header-left {
        .toggle-menu {
          padding: 5px;
          cursor: pointer;
        }
      }
      .header-right {
        display: flex;
        align-items: center;
        .username {
          padding-right: 5px;
          color: #333;
        }
      }
    }
    .breadcrumb {
      padding: 0 20px;
      margin-top: 10px;
      margin-bottom: -10px;
    }
    .main {
      padding: 20px;
    }
  }
}

/deep/ {
  .el-menu {
    .el-menu-item {
      width: 100%;
      &.is-active {
        background: rgb(67, 74, 80) !important;
      }
    }
  }
  .el-dropdown {
    cursor: pointer;
  }
}
</style>
