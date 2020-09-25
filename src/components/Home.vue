<template>
  <el-container class="container-box">
    <el-header>
      <div class="header-left">
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" size="small" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <!-- 侧边栏的主体 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="iscollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="(subItem, index) in item.children"
              :key="subItem.id"
              
              @click="activePathStatus('/' + subItem.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体 -->
      <el-main>
        <!-- 路由占位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      activePath:'',
      iscollapse: false,
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      }
    };
  },

  mounted() {
    this.getMenuList();
    // 重新加载页面，激活二级菜单
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取左侧的数据
    async getMenuList() {
      let { data: res } = await this.$http.get("menus");
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      //  this.$message.error(res.meta.msg)
    },

    //点击按钮，折叠侧边栏
    toggleCollapse() {
      this.iscollapse = !this.iscollapse;
    },

    //点击按钮，激活二级菜单
    activePathStatus(activePath){
      // 路径保存本地
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  }
};
</script>

<style scoped lang="less">
.container-box {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  .header-left {
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
      color: #fff;
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}

.toggle-btn {
  background: cadetblue;
  text-align: center;
  color: #fff;
  line-height: 22px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
