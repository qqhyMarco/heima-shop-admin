<template>
    <div>
      <!-- 顶部面包屑 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card >
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="权限名称" align="center" prop="authName"></el-table-column>
        <el-table-column label="路径" align="center" prop="path"></el-table-column>
        <el-table-column label="权限登等级" align="center" prop="level">
          <template slot-scope="{row,$index}">
            <el-tag v-if="row.level ==='0' ">标签一</el-tag>
            <el-tag type="success" v-else-if="row.level === '1'">标签二</el-tag>
            <el-tag type="info" v-else>标签三</el-tag>
          </template>
        </el-table-column>
          
          
      
      </el-table>
      
    </el-card>
    

    </div>
</template>

<script>
export default {
  name:'Power',
    data() {
        return {
          rightsList:[]
        };
    },
  
    mounted() {
      this.getRightsList()
    },
    methods: {

      // 请求用户权限数据
      async getRightsList(){
        let {data :res}  = await this.$http.get('rights/list')
        // console.log(res)
        if(res.meta.status !==200) return this.$message.error('获取权限数据失败')
        this.rightsList = res.data
      }
    }
};
</script>

<style scoped lang="less">

</style>
