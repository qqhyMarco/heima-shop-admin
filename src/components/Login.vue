<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img class="img-box" src="../assets/logo.png" alt="" />
      </div>

      <!-- 登录表单 -->
      <el-form ref="loginFormRef"    :model="loginForm" :rules="loginFormRules"  class="login-form" style="width:100%">
        <el-form-item  prop="username">
          <el-input   v-model="loginForm.username"   prefix-icon="iconfont  icon-user"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input  v-model="loginForm.password"   prefix-icon="iconfont  icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button type="primary" size="middle" @click="login" >登录</el-button>
           <el-button type="warning" size="middle" @click="reset">提交</el-button>
        </el-form-item>
        
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm:{
        username:'admin',
        password:'123456'
      },

      loginFormRules:{
        username:[
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],

        password:[
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
        
      }
    };
  },
  
  mounted() {},
  methods: {
    reset(){
      // 点击重置按钮，输入框数据消失
      this.$refs.loginFormRef.resetFields()
      // console.log(this)
    },

    login(){
      this.$refs.loginFormRef.validate(async (vali)=>{
        // console.log(vali)

        if(!vali) return 
         // 发送请求
        let {data}= await this.$http.post('login', this.loginForm)
        console.log(data)
        if(data.meta.status ===200){

          this.$message.success('登录成功')
          window.sessionStorage.setItem('token',data.data.token)
          this.$router.push('/home')

        }else{
          this.$message.error('登录失败')
        }
      })
    }
  }
};
</script>

<style scoped lang="less">
.login-container {
  height: 100%;
  width: 100%;
  background-color: #2b4b6b;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar-box {
      width: 130px;
      height: 130px;
      background-color: white;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #abc;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);

      .img-box {
        height: 100%;
        width: 100%;
        border: 1px solid blue;
        border-radius: 50%;
        background-color: red;
      }
    }
  }

  .login-form {
    position: absolute;
    bottom: 0px;
    padding: 0 10px;
    box-sizing: border-box;

    .login-btn{
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
