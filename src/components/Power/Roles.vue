<template>
    <div>
          <!-- 顶部面包屑 -->
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card >
          <el-button type="primary" >添加角色</el-button>

          <el-table :data="roleslist" border stripe>
            <el-table-column type="expand">
              <template slot-scope="{row ,$index}">
                <el-row class="vcone"  v-for="(item1,index1) in row.children" :key="item1.id"  :class="['bdbottom', index1===0 ? 'bdtop':'']">
                  <el-col :span="5">
                    <el-tag  @close="removeright(row, item1.id)" closable type="danger" >{{item1.authName}} </el-tag>
                     <i class="el-icon-caret-right"></i>
                    
                  </el-col>

                  <!-- 渲染二级和三级权限 -->
                  <el-col :span="19">
                      <el-row class="vctwo" v-for="(item2, index2) in item1.children" :key="item2.id"  :class="index2 ===0 ? '': 'bdtop'  ">
                        <el-col :span="6">
                          <el-tag  @close="removeright(row, item2.id)" closable  type="success" >{{item2.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                          
                        </el-col>
                        <!-- 渲染三级 -->
                        <el-col :span="18">
                          <el-tag @close="removeright(row, item3.id)" closable  type="info"  v-for="(item3, index3) in item2.children" :key="item3.id" >{{item3.authName}}</el-tag>
                          
                          
                        </el-col>
                     
                    </el-row>

                  </el-col>
                    
                  
                
                </el-row>
                  <!-- <pre>{{row}}</pre> -->
                
              </template>
            </el-table-column>

            <el-table-column  type="index" align="center" ></el-table-column>
            <el-table-column  label="角色名称" align="center" prop="roleName"></el-table-column>
            <el-table-column  label="角色名称" align="center" prop="roleDesc"></el-table-column>
            <el-table-column  label="操作"   width="300px">
              <template slot-scope="{row, $index}">
                  <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delet" size="mini">删除</el-button>
                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(row)">分配权限</el-button>
              </template>
            </el-table-column>
             
          
          </el-table>
          
          
        </el-card>

        <!-- 分配权限弹框 -->
        <el-dialog
            title="提示"
            :visible.sync="setRightdialogVisible"
            width="50%"
            @closed='setRightdialogClosed'
            >
            <el-tree :data="rolesTreeList" :props="treeProps" 
            show-checkbox node-key='id' default-expand-all  
            :default-checked-keys='defaultKey' ref="treeRef"
            
            ></el-tree>
            <span slot="footer" class="dialog-footer">
              <el-button @click="setRightdialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="creatRight">确 定</el-button>
            </span>
      </el-dialog>
        

    </div>
</template>

<script>
export default {
  name:'roles',
    data() {
        return {
          roleslist:[],
          setRightdialogVisible:false,
          // 树形权限数据
          rolesTreeList:[],
          // 树形控件树形绑定对象
          treeProps: {
            children: 'children',
            label: 'authName'
          },

          // 默认节点id数组
          defaultKey:[],
          // 获取用户 的角色id
          roleId:''

        };
    },
   
    mounted() {
      this.getrolesList()
    },
    methods: {
      // 请求角色列表
      async  getrolesList(){
         let {data :res}= await this.$http.get('roles')
        //  console.log(res)
        if(res.meta.status !==200) return this.$message.error('获取角色列表失败')
        this.roleslist = res.data
      },

      // 点击tag,移除tag
      async  removeright(role, item3Id){

        let result = await  this.$confirm('是否要删除？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .catch(error=>error)

        // console.log(result)
        if(result !== 'confirm'){
          return this.$message.info('取消删除')
       
        } 

        let {data: res} = await this.$http.delete(`roles/${role.id}/rights/${item3Id}`)
        // console.log(res)
        if(res.meta.status !==200) return this.$message.error('删除权限失败')
        // 重新渲染数据，删除请求返回最新的数据
        role.children = res.data

        // this.getrolesList()

        this.$message.success('确认删除')

      },

      // 点击分配权限，弹出框
      async   showSetRightDialog(row){
        // 获取该用户的角色Id
        this.roleId = row.id

        let {data :res} = await this.$http.get('rights/tree')
        // console.log(res)
        if(res.meta.status !==200) return this.$message.error('获取数据失败')
        this.rolesTreeList = res.data
        // 调用递归函数，保存三级id
        this.getLeafKeys(row,this.defaultKey)

        this.setRightdialogVisible =true

      },

      // 递归获取三级商品的id
      getLeafKeys(node,arr){
        if(!node.children){
          // 是三级节点
          return arr.push(node.id)
        }

        // 不是三级节点
        node.children.forEach(item => {
          this.getLeafKeys(item,arr)
          
        });

      },

      // 关闭权限弹框，清除上一次的三级节点id数组
      setRightdialogClosed(){
        this.defaultKey = null
      },

      // 分配权限点击确定按钮，分配权限
       async  creatRight(){
        // console.log(this.$refs.treeRef)

        //返回目前被选中的节点的 key(id) 所组成的数组
        const checkedArr= [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]

        // 将数组变成字符窜
        const checkedStr = checkedArr.join()
        // console.log(checkedStr)

        // 发送请求，分配权限
        let {data:res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids:checkedStr})
        // console.log(res)
        if( res.meta.status !==200) return this.$message.error('分配权限失败')
        this.$message.success('分配权限成功')
        // 重新发送页面请求
        this.getrolesList()
        this.setRightdialogVisible = false


      }
     

    } 
};
</script>

<style scoped lang="less">

  .el-tag{
    margin: 7px;
  }

  .bdbottom{
    border-bottom: 1px solid hotpink;
  }

  .bdtop{
    border-top: 1px solid hotpink;
  }


.vcone{
  display: flex;
  align-items: center;
}

.vctwo{
  display: flex;
  align-items: center;
}
</style>
