<template>
    <el-form class="login" ref="formInline" :model="formInline" :rules="ruleInline" :inline=false>
      <h1>教务管理系统</h1>
      <br>
      <el-form-item prop="username">
        <el-input type="text" v-model="formInline.username" placeholder="用户名">
          <i class="el-icon-user-solid" slot="prepend"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="formInline.password" placeholder="密码">
          <i class="el-icon-lock" slot="prepend"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="type">
        <template>
          <el-radio v-model="formInline.type" label="student">学生</el-radio>
          <el-radio v-model="formInline.type" label="teacher">教师</el-radio>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit()">登录</el-button>
      </el-form-item>
    </el-form>
</template>

<script>
export default {
  data () {
    return {
      formInline: {
        username: '',
        password: '',
        type: 'student'
      },
      ruleInline: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 2, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$axios.get('http://localhost:5000/logIn', {
        params: {
          username: this.formInline.username,
          password: this.formInline.password,
          type: this.formInline.type
        }
      }).then(response => {
        if (response.data.logInStatus === 'success') {
          console.log(response.data.logInStatus)
          // delete response.data.logInStatus
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          if (this.formInline.type === 'student') {
            console.log('student')
            this.$router.push({
              name: 'SelectCourse',
              params: response.data
            })
          } else if (this.formInline.type === 'manage') {
            this.$router.push({
              name: 'Manage',
              params: {
                user: 'SYSTEM',
                courseInfo: response.data.courseInfo,
                teacherInfo: response.data.teacherInfo,
                studentInfo: response.data.studentInfo
              }
            })
          } else if (this.formInline.type === 'teacher') {
            this.$router.push({
              name: 'GradeManage',
              params: {
                user: response.data.userInfo,
                courseInfo: response.data.courseInfo
              }
            })
          }
        } else {
          this.$message.error('用户名或密码输入错误!')
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style>
.login{
  position: absolute;/*绝对定位*/
  width: 300px;
  height: 200px;

  text-align: center;/*(让div中的内容居中)*/
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -150px;
}
</style>
