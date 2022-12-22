<template>
  <el-container>
    <!-- header -->
    <el-header>
      <el-row>
        <el-col :span="16">
          <div style="font-size: 20px">
            <b>Student Course Selection System</b>
          </div>
        </el-col>
        <el-col :span="8">
          <template v-if="sNo==null">
            <div style="text-align: right">
              <el-button type="text" @click="handleSignOut()" style="color: #FFB200">Sign In</el-button>
            </div>
          </template>
          <template v-else>
            <div style="text-align: right">
              {{ sNo }}&nbsp;&nbsp;{{ sName }}
              <el-button type="text" @click="handleSignOut()" style="color: #FFB200">Sign Out</el-button>
            </div>
          </template>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="box">
      <!-- aside -->
      <el-aside>
        <!-- function selection -->
        <el-menu
          :active-name="activeName"
          default-active="1"
          width="auto">
          <el-menu-item index="1" @click.native="select()">
            <i class="el-icon-edit"></i>
            <span>Select Courses</span>
          </el-menu-item>
          <el-menu-item index="2" @click.native="showCompletedCourses()">
            <i class="el-icon-document"></i>
            <span>Check Completed Courses</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <template v-if="isSelect">
        <!-- select course -->
          <div>
            <el-form ref="selectCourseInfo" :inline=true>
              <el-form-item>
                <el-input type="text" v-model="inputCourseCode" placeholder="Please enter the course code" style="width: 300px"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :disabled="!inputCourseCode" @click="handleSearch()">Search</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :disabled="button1IsAble" @click="handleSelect()">Select</el-button>
              </el-form-item>
              <el-form-item>
                <el-button plain :disabled="!inputCourseCode" @click="handleEmpty()">Clear</el-button>
              </el-form-item>
            </el-form>
            <el-table
              ref="multipleTable"
              :data="dataCourse"
              empty-text="No data."
              @selection-change="handleSelectChange"
              style="width: 100%">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="code" label="Course Code"></el-table-column>
              <el-table-column prop="name" label="Course Name"></el-table-column>
              <el-table-column prop="credit" label="Unit" width="70"></el-table-column>
              <el-table-column prop="department.name" label="Department"></el-table-column>
              <el-table-column prop="teacher.name" label="Teacher"></el-table-column>
            </el-table>
            <el-pagination
              v-show="this.dataCourse!==''"
              small
              layout="prev, pager, next"
              :page-size="pageSize"
              :pager-count="5"
              :total="pageCountSearch"
              @current-change="handleCurrentChangeSearch">
            </el-pagination>
          </div>
          <br>
          <div>
            <el-row>
              <el-col :span="16">
                <div>
                  <p>Selected Course(s): </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div style="text-align: right">
                  <el-button type="primary" :disabled="button2IsAble" @click="handleDrop()">Drop</el-button>
                </div>
              </el-col>
            </el-row>
            <el-table
              ref="multipleTable"
              :data="selectedCourses"
              empty-text="No courses selected."
              @selection-change="handleDropChange"
              style="width: 100%">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="code" label="Course Code"></el-table-column>
              <el-table-column prop="name" label="Course Name"></el-table-column>
              <el-table-column prop="credit" label="Unit" width="70"></el-table-column>
              <el-table-column prop="department.name" label="Department"></el-table-column>
              <el-table-column prop="teacher.name" label="Teacher"></el-table-column>
            </el-table>
            <el-pagination
              v-show="this.selectedCourses!==''"
              small
              layout="prev, pager, next"
              :page-size="pageSize"
              :pager-count="5"
              :total="pageCountSelected"
              @current-change="handleCurrentChangeSelected">
            </el-pagination>
          </div>
        </template>
        <template v-else>
          <div>
            <p>Completed Course(s):</p>
          </div>
          <el-table
            :data="completedCourses"
            border
            empty-text="No courses completed."
            style="width: 100%">
            <el-table-column prop="course.code" label="Course Code"></el-table-column>
            <el-table-column prop="course.name" label="Course Name"></el-table-column>
            <el-table-column prop="grade" label="Grade"></el-table-column>
            <el-table-column prop="point" label="Point"></el-table-column>
          </el-table>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="16">
              <div>
                <p>Transcript:</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="text-align: right">
                <el-button type="primary">Download</el-button>
              </div>
            </el-col>
          </el-row>
          <el-card>
            <h1 align="center" style="font-size: 20px">Transcript</h1>
            <div align="right">
              <span>{{sNo}}&nbsp;&nbsp;{{sName}}&nbsp;&nbsp;</span>
              <span>{{year}}.{{month}}.{{day}}</span>
            </div>
            <el-table
              :data="completedCourses"
              border
              empty-text="No courses completed."
              style="width: 100%">
              <el-table-column prop="course.code" label="Course Code"></el-table-column>
              <el-table-column prop="course.name" label="Course Name"></el-table-column>
              <el-table-column prop="grade" label="Grade"></el-table-column>
              <el-table-column prop="point" label="Point"></el-table-column>
              <el-table-column prop="course.credit" label="Unit"></el-table-column>
            </el-table>
            <p>GPA: {{avgGrade}}</p>
          </el-card>
        </template>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    this.currentPageSelected = 1
    var date = new Date()
    this.updateSelected()
    return {
      // 学生信息
      sNo: this.$route.params.no,       // student number
      sName: this.$route.params.name,   // student name
      isSelect: true,					          // function selection
      activeName: '1',				          // default function
      inputCourseCode: '',						  // search course input
      button1IsAble: true,
      button2IsAble: true,
      dataCourse: [],                   // course data for table
      selectedCourses: [],              // selected courses data for table
      completedCourses: [],             // completed courses data for table
      selectCourse: [],					        // course code for selecting
      dropCourse: [],						        // course code for dropping
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      avgGrade: 0,
      pageCountSearch: 0,
      pageCountSelected: 0,
      pageSize: 4
    }
  },
  methods: {
    handleSignOut() {
      this.$axios({
        method: 'get',
        url: '/signOut'
      })
      this.$router.push('/')
    },
    select () {
      this.isSelect = true
      this.currentPageSelected = 1
    },
    showCompletedCourses () {
      this.isSelect = false
      this.$axios({
        method: 'get',
        url: '/grade/'+this.sNo
      }).then(response => {
        this.completedCourses = response.data
      }).catch(error => {
        console.log(error)
        this.isSelect = false
      })
      this.$axios({
        method: 'get',
        url: '/getGPA/'+this.sNo
      }).then(response => {
        this.avgGrade = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    handleSelectChange (selection) {
      // select courses selection change
      this.selectCourse = selection
      this.button1IsAble = selection.length === 0;
    },
    handleSelect () {
      // select courses
      this.$axios({
        method: 'post',
        url: '/grade/'+this.sNo+'/'+JSON.stringify(this.selectCourse)
      }).then(response => {
        if (response.data === "success") {
          if (this.selectCourse.length===1) {
            this.$message({
              message: 'Select the course successfully.',
              type: 'success'
            })
          } else {
            this.$message({
              message: 'Select the courses successfully.',
              type: 'success'
            })
          }
        } else {
          let courses = response.data
          let failCCode = courses[0]
          for (let i = 1; i < courses.length; i++) {
            failCCode = failCCode + '，' + courses[i]
          }
          this.$message.error('You have already selected course ' + failCCode + '.')
        }
        this.updateSelected()
      }).catch(error => {
        console.log(error)
      })
    },
    updateSelected () {
      this.pageSize = 4
      // update selected courses
      this.$axios({
        method: 'get',
        url: '/selectedCourseNum/'+this.$route.params.no
      }).then(response => {
        this.pageCountSelected = JSON.parse(response.data)
      })
      this.$axios({
        method: 'get',
        url: '/selectedCourse/'+this.$route.params.no+'/'+this.currentPageSelected+'/'+this.pageSize
      }).then(response => {
        this.selectedCourses = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    handleCurrentChangeSelected(currentPage) {
      this.currentPageSelected = currentPage
      this.$axios({
        method: 'get',
        url: '/selectedCourse/'+this.$route.params.no+'/'+currentPage+'/'+this.pageSize
      }).then(response => {
        this.selectedCourses = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    handleDropChange (selection) {
      // drop course selection change
      this.dropCourse = selection
      this.button2IsAble = selection.length === 0;
    },
    handleDrop () {
      // 退课
      this.$axios({
        method: 'post',
        params: {
          _method: 'delete'
        },
        url: '/grade/'+this.sNo+'/'+JSON.stringify(this.dropCourse)
      }).then(response => {
        if (response.data==="success") {
          this.$message({
            message: 'Drop the course(s) successfully.',
            type: 'success'
          })
          this.updateSelected()
        } else {
          this.$message.error('There is something wrong with the system. Please try it later.')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleSearch () {
      // 搜索课程
      this.$axios({
        method: 'get',
        url: '/courseNum/'+this.inputCourseCode
      }).then(response => {
        this.pageCountSearch = JSON.parse(response.data)
      })
      this.$axios({
        method: 'get',
        url: '/course/'+this.inputCourseCode+'/1/'+this.pageSize
      }).then(response => {
        this.dataCourse = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    handleCurrentChangeSearch(currentPage) {
      this.$axios({
        method: 'get',
        url: '/course/'+this.inputCourseCode+'/'+currentPage+'/'+this.pageSize
      }).then(response => {
        this.dataCourse = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    handleEmpty () {
      // 清空搜索框
      this.inputCourseCode = ''
      this.dataCourse = ''
      this.pageCountSearch = 0
    },
  }
}
</script>

<style scoped>
.el-header {
  background-color: #277BC0;
  color: #fff;
  /*text-align: center;*/
  line-height: 60px;
  /*font-size: 20px;*/
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
  /*text-align: center;*/
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
