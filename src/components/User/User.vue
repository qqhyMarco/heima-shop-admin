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
        <el-row :gutter="20">
            <el-col :span="18">
                <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear='getUserlist'>
                     <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
                </el-input>
            </el-col>

            <el-col :span="4">
                <el-button type="primary"  @click="dialogVisible=true">添加用户</el-button>
            </el-col>
        </el-row>

        <!-- 表格视图 -->
        <el-table :data="userlist" border stripe>
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="姓名" prop="username" align="center"></el-table-column>
            <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
            <el-table-column label="电话" prop="mobile" align="center"></el-table-column>
            <el-table-column label="角色" prop="role_name" align="center"></el-table-column>
            <el-table-column label="状态" prop="mg_state">
                <template slot-scope="{row,$index}">

                <el-switch   v-model="row.mg_state" @change="userstatechange(row)"></el-switch>
            
                </template>
            </el-table-column>
            <el-table-column label="操作"  width="180">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editdilog(row.id)"></el-button>
                    <el-button type="warning" icon="el-icon-delete" size="mini" @click="deletUser(row.id)"></el-button>
                    <el-tooltip  effect="dark" content="分配角色" placement="top-start" :enterable="false">
                        <el-button type="info" icon="el-icon-setting" size="mini" ></el-button>
                    </el-tooltip>
                    
                </template>
            </el-table-column>
            
            
        </el-table>

        
        <!-- 分页器 -->
        <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout=" sizes,total, prev, pager, next, jumper "
        :total="total">
        </el-pagination>


    </el-card>

    <!-- 添加用户弹框 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        @close="dialogClose"
        >
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
            <el-form-item label="姓名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>    
        <span slot="footer" >
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 编辑弹框 -->
    <el-dialog
        title="编辑用户"
        :visible.sync="editdialogVisible"
        width="50%"
        @close='editdialogClose'
        >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
            <el-form-item label="姓名" prop="username">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
        </el-form>   
        <span slot="footer" class="dialog-footer">
            <el-button @click="editdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
    </el-dialog>

    

  </div>
</template>

<script>
export default {
    name:"User",
  data() {
      // 验证自定义邮箱规则
         var emailrule = (rule, value, callback) => {
             // 验证邮箱的正则表达式
             const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                // 验证通过
                return callback()
            
            } 
            callback(new Error('请输入合法的邮箱'));
         }

         // 验证自定义手机号规则
         var mobilerule = (rule, value, callback) => {
             // 验证邮箱的正则表达式
             const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                // 验证通过
                return callback()
            
            } 
            callback(new Error('请输入合法的手机号'));
         }

    return {

        // 表单数据
        addForm:{
            username:'',
            password:'',
            email:'',
            mobile:'',

        },
        // 查询用户信息
        editForm:{},

        // 编辑弹框
        editdialogVisible:false,

        // 弹框状态
        dialogVisible:false,
        queryInfo:{
            query:'',
            // 当前页
            pagenum:1,
            // 每页条数
            pagesize:4
        },

        userlist:[],
        // 总条数
        total:0,

        // 验证规则
        addFormRules:{
            username:[
                { required: true, message: '请输入姓名', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
            ],

            password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
            ],
            email:[
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: emailrule, trigger: 'blur' }
            ],

            mobile:[
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator: mobilerule, trigger: 'blur' }
            ]
        },

        // 编辑用户验证规则
        editFormRules:{
            
            mobile:[
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator: mobilerule, trigger: 'blur' }
            ],
            email:[
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: emailrule, trigger: 'blur' }
            ],
            
        }

        
    };
  },
  
  mounted() {
      this.getUserlist()
  },
  methods: {
    //   请求用户数据
    async  getUserlist(){
        let{data : res} = await this.$http.get('users', {params:this.queryInfo})
        // console.log(res)
        if(res.meta.status ===200){
            this.userlist = res.data.users
            this.total = res.data.total
        }else{
            this.$message.error(res.meta.msg+','+res.meta.status)
        }
       
    },

    // 监听每页条数事件
    handleSizeChange(newPages){
        // console.log(newPages)
        this.queryInfo.pagesize = newPages
        // 重新发送请求
        this.getUserlist()
    },

    // 监听当前页事件
    handleCurrentChange(currentPage){
        // console.log('当前页'+handleCurrentChange)
        this.queryInfo.pagenum = currentPage
        this.getUserlist()
    },

    // 监听用户状态改变事件
    async  userstatechange(row){
        // console.log(row)
        // 发送请求
        let {data : res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
        // console.log(res)
        if(res.meta.status !== 200) {
            // 状态更改
            row.mg_state =!row.mg_state
            return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
    },

    // 监听dialog关闭事件
    dialogClose(){
        // 让表单初始化
        this.$refs.addFormRef.resetFields()
    },

    // 点击确定，添加新用户
    addUser(){
        // 表单预校验
        this.$refs.addFormRef.validate(async valid=>{
            // console.log(valid)
            if(!valid) return this.$message.error('输入错误内容')
            // 校验成功，发送请求，添加用户
            let {data : res } = await this.$http.post('users', this.addForm)
            if(res.meta.status !==201) return this.$message.error(res.meta.msg+','+res.meta.status)
            // 请求发送成功
            this.$message.success(res.meta.msg)
            // 关闭dialog弹框
            this.dialogVisible = false
            // 重新请求页面数据
            this.getUserlist()


            
        })
    },

    // 点击修改按钮，弹出编辑框
    async  editdilog(id){
        // console.log(id)
        // 发送请求，查询用户信息
        let {data : res}= await this.$http.get(`users/${id}`)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg+','+res.meta.status)
        this.editForm = res.data
        this.editdialogVisible=true
    },

    // 关闭修改弹框的事件
   
    editdialogClose(){
        this.$refs.editFormRef.resetFields()
    },

    // 修改用户，并提交
    editUserInfo(){
        this.$refs.editFormRef.validate( async valid=>{
            // console.log(valid)
            if(!valid) return this.$message.error('验证信息有误')
            // 发送请求，提交修改信息
            let editFormInfo = {
                
                email: this.addForm.email,
                mobile: this.addForm.mobile
                
            }
            let {data : res} = await this.$http.put(`users/${this.editForm.id}`, editFormInfo)
            console.log(res)
            if(res.meta.status !==200) return this.$message.error(res.meta.msg+','+res.meta.status)
            // 提示
            this.$message.success(res.meta.msg)
            // 重新刷新页面
            this.getUserlist()
            // 关闭编辑框
            this.editdialogVisible = false
            
        })
    },

    // 删除用户
    async deletUser(id){
        // console.log(id)
        let result = await   this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error)

        // console.log(result)
        if(result !=='confirm') return this.$message.error('取消删除')
        // alert('删除成功')
        let {data :res} = await this.$http.delete(`users/${id}`)
        console.log(res)
        if(res.meta.status !==200) return this.$message.error('删除失败')
        this.$message.success(res.meta.msg)
         // 重新请求页面数据
            this.getUserlist()

    }

  }
};
</script>

<style scoped lang="less"></style>
