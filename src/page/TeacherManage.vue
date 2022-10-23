<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="16">
          <div style="font-size: 20px">
            <b>Administrator Course Management System</b>
          </div>
        </el-col>
        <el-col :span="8">
          <template v-if="no == null">
            <div style="text-align: right">
              <el-button type="text" @click="handleSignOut()" style="color: #FFB200">Sign In</el-button>
            </div>
          </template>
          <template v-else>
            <div style="text-align: right">
              {{ no }}&nbsp;&nbsp;{{ name }}
              <el-button type="text" @click="handleSignOut()" style="color: #FFB200">Sign Out</el-button>
            </div>
          </template>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu
          v-model="activeNameMenu"
          default-active="1"
          width="auto"
          @select="menuClick">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>
              <span>Grade Management</span>
            </template>
            <el-menu-item
              v-for="(item, value) in courseNameList"
              :index="'1-'+value"
              :key = "value"
              @click="handleCurrentCourse">
              {{ item }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-card>
          <div>
            <p>Students who completed the course:</p>
            <el-table
              :data = "completedCourseStudent"
              empty-text="No student data."
              border
              height="250"
              style="width: 100%">
              <el-table-column prop="sNo" label="Student No"></el-table-column>
              <el-table-column prop="grade" label="Grade"></el-table-column>
              <el-table-column prop="point" label="Point"></el-table-column>
            </el-table>
          </div>
        </el-card>
        <br>
        <el-card>
          <div>
            <el-form :inline="true" :model="inputGrade">
              <el-form-item label="Grade">
                <el-input v-model="inputGrade.grade"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmitGrade">Submit</el-button>
              </el-form-item>
            </el-form>
            <p>Students who are currently taking the course</p>
            <el-table
              ref="singleTable"
              :data = "selectedCourseStudent"
              empty-text="No student data."
              border
              highlight-current-row
              @current-change="handleStudentSelectChange"
              height="250"
              style="width: 100%">
              <el-table-column prop="no" label="Student No"></el-table-column>
              <el-table-column prop="name" label="Name"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  data(){
    if (this.$route.params.no !== null) {
      this.$axios.get("http://localhost:5000/teacher", {
        params: {
          no: this.$route.params.no,
          action: "courseNameList"
        }
      }).then(response =>{
        this.courseNameList = JSON.parse(response.data.courseNameList)
      })
    }
    return {
      no: this.$route.params.no,
      name: this.$route.params.name,
      activeNameMenu: '1',
      courseNameList: [],
      currentCourse: '',
      completedCourseStudent: [],
      selectedCourseStudent: [],
      inputGrade: {
        grade: ''
      },
      currentStudent: null
    }
  },
  methods: {
    handleSignOut() {
      this.$router.push('/')
    },
    menuClick(index) {
      this.activeNameMenu = index
    },
    handleCurrentCourse() {
      this.currentCourse = this.courseNameList[parseInt(this.activeNameMenu.slice(2))]
      this.getCompletedCourseStudent()
      this.getSelectedCourseStudent()
    },
    getCompletedCourseStudent() {
      this.$axios.get("http://localhost:5000/teacher", {
        params: {
          cName: this.currentCourse,
          tNo: this.no,
          action: "completedCourseStudent"
        }
      }).then(response => {
        this.completedCourseStudent = JSON.parse(response.data.completedCourseStudent)
      }).catch(error =>{
        console.log(error)
      })
    },
    getSelectedCourseStudent() {
      this.$axios.get("http://localhost:5000/teacher", {
        params: {
          cName: this.currentCourse,
          tNo: this.no,
          action: "selectedCourseStudent"
        }
      }).then(response => {
        this.selectedCourseStudent = JSON.parse(response.data.selectedCourseStudent)
      }).catch(error =>{
        console.log(error)
      })
    },
    handleSubmitGrade() {
      if (this.currentStudent==null) {
        this.$message.error("Please select a student below.")
      } else if (this.inputGrade.grade>=0 && this.inputGrade.grade<=100) {
        this.$axios.get("http://localhost:5000/teacher", {
          params: {
            sNo: this.currentStudent.no,
            grade: this.inputGrade.grade,
            cName: this.currentCourse,
            action: "submitGrade"
          }
        }).then(response => {
          console.log(response.data)
          if (response.data.status === "success") {
            this.getSelectedCourseStudent()
            this.getCompletedCourseStudent()
            this.inputGrade.sNo = ''
            this.inputGrade.grade = ''
          }
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$message.error("Grade Input Error.")
      }
    },
    handleStudentSelectChange(val) {
      this.currentStudent = val
    },
  }
}
</script>

<style scope>
.el-header {
  background-color: #277BC0;
  color: #fff;
  line-height: 60px;
}
.el-aside {
  background-color: #FFF4CF;
  color: #333;
  text-align: left;
  line-height: 200px;
}
.el-main {
  background-color: #fff;
  color: #333;
}
.el-menu {
  background-color: #FFF4CF;
  height: 100%;
}
.el-container {
  height: 100vh
}
.el-menu-item.is-active {
  background-color: #FFCB42;
  color: #fff;
}
</style>
