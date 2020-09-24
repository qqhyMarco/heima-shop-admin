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
      <el-aside width="200px">
        <!-- 侧边栏的主体 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>导航二</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
   name:'Home',
  data() {
    return {
      // 左侧菜单数据
      menuList:[]
    };
  },

  mounted(){
    this.getMenuList()
  },

  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取左侧的数据
    async  getMenuList(){
      let {data : res} = await this.$http.get('menus')
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      //  this.$message.error(res.meta.msg)
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
}

.el-main {
  background-color: #eaedf1;
}
</style>
