<template>
  <el-form class="login" ref="form" :model="form" :rules="rule" :inline=false>
    <h1>Course Management System</h1>
    <br>
    <el-form-item prop="username">
      <el-input type="text" v-model="form.username" placeholder="username">
        <i class="el-icon-user-solid" slot="prepend"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="form.password" placeholder="password">
        <i class="el-icon-lock" slot="prepend"></i>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-radio-group v-model="form.type">
        <el-radio label="student">Student</el-radio>
        <el-radio label="teacher">Teacher</el-radio>
        <el-radio label="administrator">Administrator</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit()">Sign In</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: '',
        type: 'student'
      },
      rule: {
        username: [
          { required: true, message: 'Please enter the username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter the password', trigger: 'blur' },
          { type: 'string', min: 2, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$axios.get('http://localhost:5000/signIn', {
        params: {
          username: this.form.username,
          password: this.form.password,
          type: this.form.type
        }
      }).then(response => {
        if (response.data.signInStatus === 'success') {
          console.log(response.data.signInStatus)
          // delete response.data.logInStatus
          this.$message({
            message: 'Sign in successfully!',
            type: 'success'
          })
          if (this.form.type === 'student') {
            var selectedCourses = JSON.parse(response.data.selectedCourses)
            this.$router.push({
              name: 'SelectCourse',
              params: {
                no: response.data.no,
                name: response.data.name,
                selectedCourses: selectedCourses
              }
            })
          } else if (this.form.type === 'administrator') {
            this.$router.push({
              name: 'AdministratorManage',
              params: {
                no: response.data.no,
                name: response.data.name
              }
            })
          } else if (this.form.type === 'teacher') {
            this.$router.push({
              name: 'TeacherManage',
              params: {
                no: response.data.no,
                name: response.data.name
              }
            })
          }
        } else {
          this.$message.error('Username or password is wrong!')
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
  position: absolute;
  width: 600px;
  height: 400px;

  text-align: center;
  top: 50%;
  left: 50%;
  margin-left: -300px;
  margin-top: -200px;

}
</style>
