<template>
  <el-container>
    <!-- header -->
    <el-header>
      <el-row>
        <el-col :span="16">
          <div style="font-size: 20px">
            <b>Administrator Course Management System</b>
          </div>
        </el-col>
        <el-col :span="8">
          <template v-if="aNo==null">
            <div style="text-align: right">
              <el-button type="text" @click="handleSignOut()" style="color: #FFB200">Sign In</el-button>
            </div>
          </template>
          <template v-else>
            <div style="text-align: right">
              {{ aNo }}&nbsp;&nbsp;{{ aName }}
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
          :unique-opened = "true"
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
              :key="value"
              @click="handleCurrentCourse">
              {{ item }}
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-info"></i>
              <span>Information Management</span>
            </template>
            <el-menu-item index="2-1">Course Information</el-menu-item>
            <el-menu-item index="2-2">Student Information</el-menu-item>
            <el-menu-item index="2-3">Teacher Information</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <template v-if="activeNameMenu.slice(0,1)==='1'">
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
        </template>
        <!-- Course Info Management -->
        <template v-if="activeNameMenu==='2-1'">
          <el-tabs v-model="activeNameCourse" @tab-click="handleCourseClick">
            <el-tab-pane label="Create Course" name="first"></el-tab-pane>
            <el-tab-pane label="Edit/Delete Course" name="second"></el-tab-pane>
          </el-tabs>
          <!-- create course -->
          <template v-if="activeNameCourse==='first'">
            <div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-button
                    type="primary"
                    @click="handleCreateCourse"
                    :disabled="!newCourse.cCode"
                    style="width: 100%">Create</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button plain @click="handleClearCourse" style="width: 100%">Clear</el-button>
                </el-col>
              </el-row>
            </div>
            <br>
            <div>
              <el-form
                :model="newCourse"
                label-width="120px">
                <el-form-item label="Course Code">
                  <el-input v-model="newCourse.cCode" maxlength="8" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="Course Name">
                  <el-input v-model="newCourse.cName"></el-input>
                </el-form-item>
                <el-form-item label="Unit">
                  <el-input-number v-model="credit" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="Department">
                  <el-input v-model="newCourse.cDept"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <!-- edit/delete course -->
          <template v-if="activeNameCourse==='second'">
            <div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-button
                    type="primary"
                    @click="handleAddTeacher"
                    style="width: 100%">
                    Create
                  </el-button>
                </el-col>
                <el-col :span="12">
                  <el-button plain @click="handleClearAdd" style="width: 100%">
                    Clear
                  </el-button>
                </el-col>
              </el-row>
              <el-table
                ref="multipleTableTeacher"
                @selection-change="handleTeacherSelectChange"
                :data="dataTeacher"
                height="250"
                empty-text="No teacher data. Please add a teacher first."
                style="width: 100%">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="no" label="Teacher No"></el-table-column>
                <el-table-column prop="name" label="Name"></el-table-column>
                <el-table-column prop="department" label="Department"></el-table-column>
              </el-table>
              <p>Edit one course, and then all the items of the same course code will be changed.</p>
              <el-table
                ref="singleTable"
                :data="dataCourse.filter(dataCourse => !searchCourse ||dataCourse.cCode.includes(searchCourse))"
                highlight-current-row
                @current-change="handleCourseSelectChange"
                height="250"
                empty-text="No course data."
                style="width: 100%">
                <el-table-column prop="cCode" label="Course Code"></el-table-column>
                <el-table-column prop="cName" label="Course Name">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.cName}}</span>
                    <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.cName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="credit" label="Unit">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.credit}}</span>
                    <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.credit"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="cDept" label="Department">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.cDept}}</span>
                    <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.cDept"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="tNo" label="Teacher No"></el-table-column>
                <el-table-column label="" with="55" align="center">
                  <template slot="header" slot-scope="scope">
                    <el-input
                      v-model="searchCourse"
                      size="mini"
                      placeholder="Course Code"></el-input>
                  </template>
                  <template slot-scope="scope">
                    <el-button
                      v-show="!scope.row.edit"
                      type="primary"
                      icon="el-icon-edit"
                      circle
                      @click.native.prevent="handleChangeEditStatusCourse(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                    <el-button
                      v-show="scope.row.edit"
                      type="primary"
                      icon="el-icon-check"
                      circle
                      @click.native.prevent="handleEditCourse(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                    <el-button
                      v-show="scope.row.edit"
                      icon="el-icon-close"
                      circle
                      @click.native.prevent="handleCancelEditCourse(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click.native.prevent="handleDeleteCourse(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </template>
        <!-- Student Info Management -->
        <template v-if="activeNameMenu==='2-2'">
          <el-tabs v-model="activeNameStudent" @tab-click="handleStudentClick">
            <el-tab-pane label="Create Student" name="first"></el-tab-pane>
            <el-tab-pane label="Edit/Delete Student" name="second"></el-tab-pane>
          </el-tabs>
          <!-- create student -->
          <template v-if="activeNameStudent==='first'">
            <div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-button
                    type="primary"
                    @click="handleCreateStudent"
                    :disabled="(!newStudent.no) || (!newStudent.username)"
                    style="width: 100%">Create</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button plain @click="handleClearStudent" style="width: 100%">Clear</el-button>
                </el-col>
              </el-row>
            </div>
            <br>
            <div>
              <el-form
                :model="newStudent"
                label-width="120px">
                <el-form-item label="Student No">
                  <el-input v-model="newStudent.no" maxlength="8" show-word-limit></el-input>
                </el-form-item>
                <div>
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="First Name">
                        <el-input v-model="newStudent.firstName"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="Last Name">
                        <el-input v-model="newStudent.lastName"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-form-item label="Gender">
                  <el-radio v-model="newStudent.gender" label="male">Male</el-radio>
                  <el-radio v-model="newStudent.gender" label="female">Female</el-radio>
                </el-form-item>
                <el-form-item label="Birthday">
                  <el-date-picker
                    v-model="newStudent.birthday"
                    value-format="yyyy-MM-dd"
                    type="date"></el-date-picker>
                </el-form-item>
                <el-form-item label="Department">
                  <el-input v-model="newStudent.department"></el-input>
                </el-form-item>
                <el-form-item label="Username">
                  <el-input v-model="newStudent.username"></el-input>
                </el-form-item>
                <el-form-item label="Password">
                  <el-input v-model="newStudent.password"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <template v-if="activeNameStudent==='second'">
            <div>
              <el-table
                :data="dataStudent.filter(dataStudent => !searchStudent ||dataStudent.name.includes(searchStudent))"
                empty-text="No student data."
                style="width: 100%">
                <el-table-column prop="no" label="Student No"></el-table-column>
                <el-table-column prop="name" label="Name">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.name}}</span>
                    <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="gender" label="Gender">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.gender}}</span>
                    <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.gender"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="birthday" label="Birthday">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.birthday}}</span>
                    <el-date-picker
                      v-show="scope.row.edit"
                      size="mini"
                      v-model="scope.row.birthday"
                      value-format="yyyy-MM-dd"
                      type="date"></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop="department" label="Department">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.department}}</span>
                    <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.department"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="username" label="Username"></el-table-column>
                <el-table-column label="" with="55" align="center">
                  <template slot="header" slot-scope="scope">
                    <el-input
                      v-model="searchStudent"
                      size="mini"
                      placeholder="Student Name"></el-input>
                  </template>
                  <template slot-scope="scope">
                    <el-button
                      v-show="!scope.row.edit"
                      type="primary"
                      icon="el-icon-edit"
                      circle
                      @click.native.prevent="handleChangeEditStatusStudent(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                    <el-button
                      v-show="scope.row.edit"
                      type="primary"
                      icon="el-icon-check"
                      circle
                      @click.native.prevent="handleEditStudent(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                    <el-button
                      v-show="scope.row.edit"
                      icon="el-icon-close"
                      circle
                      @click.native.prevent="handleCancelEditStudent(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click.native.prevent="handleDeleteStudent(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </template>
        <!-- Teacher Info Management -->
        <template v-if="activeNameMenu==='2-3'">
          <el-tabs v-model="activeNameTeacher" @tab-click="handleTeacherClick">
            <el-tab-pane label="Create Teacher" name="first"></el-tab-pane>
            <el-tab-pane label="Edit/Delete Teacher" name="second"></el-tab-pane>
          </el-tabs>
          <!-- create teacher -->
          <template v-if="activeNameTeacher==='first'">
            <div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-button
                    type="primary"
                    @click="handleCreateTeacher"
                    :disabled="!newTeacher.no || !newTeacher.username"
                    style="width: 100%">Create</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button plain @click="handleClearTeacher" style="width: 100%">Clear</el-button>
                </el-col>
              </el-row>
            </div>
            <br>
            <div>
              <el-form
                :model="newTeacher"
                label-width="120px">
                <el-form-item label="Teacher No">
                  <el-input v-model="newTeacher.no" maxlength="8" show-word-limit></el-input>
                </el-form-item>
                <div>
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="First Name">
                        <el-input v-model="newTeacher.firstName"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="Last Name">
                        <el-input v-model="newTeacher.lastName"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-form-item label="Gender">
                  <el-radio v-model="newTeacher.gender" label="male">Male</el-radio>
                  <el-radio v-model="newTeacher.gender" label="female">Female</el-radio>
                </el-form-item>
                <el-form-item label="Birthday">
                  <el-date-picker
                    v-model="newTeacher.birthday"
                    value-format="yyyy-MM-dd"
                    type="date"></el-date-picker>
                </el-form-item>
                <el-form-item label="Department">
                  <el-input v-model="newTeacher.department"></el-input>
                </el-form-item>
                <el-form-item label="Username">
                  <el-input v-model="newTeacher.username"></el-input>
                </el-form-item>
                <el-form-item label="Password">
                  <el-input v-model="newTeacher.password"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <!-- edit teacher -->
          <template v-if="activeNameTeacher==='second'">
            <div>
              <el-table
                :data="dataTeacher.filter(dataTeacher => !searchTeacher ||dataTeacher.name.includes(searchTeacher))"
                empty-text="No teacher data."
                style="width: 100%">
                <el-table-column prop="no" label="Teacher No"></el-table-column>
                <el-table-column prop="name" label="Name">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.name}}</span>
                    <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="gender" label="Gender">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.gender}}</span>
                    <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.gender"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="birthday" label="Birthday">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.birthday}}</span>
                    <el-date-picker
                      v-show="scope.row.edit"
                      size="mini"
                      v-model="scope.row.birthday"
                      value-format="yyyy-MM-dd"
                      type="date"></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop="department" label="Department">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.department}}</span>
                    <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.department"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="username" label="Username"></el-table-column>
                <el-table-column label="" with="55" align="center">
                  <template slot="header" slot-scope="scope">
                    <el-input
                      v-model="searchTeacher"
                      size="mini"
                      placeholder="Teacher Name"></el-input>
                  </template>
                  <template slot-scope="scope">
                    <el-button
                      v-show="!scope.row.edit"
                      type="primary"
                      icon="el-icon-edit"
                      circle
                      :disabled="!editableTeacher"
                      @click.native.prevent="handleChangeEditStatusTeacher(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                    <el-button
                      v-show="scope.row.edit"
                      type="primary"
                      icon="el-icon-check"
                      circle
                      @click.native.prevent="handleEditTeacher(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                    <el-button
                      v-show="scope.row.edit"
                      icon="el-icon-close"
                      circle
                      @click.native.prevent="handleCancelEditTeacher(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click.native.prevent="handleDeleteTeacher(scope.$index, scope.row)"
                      size="mini">
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </template>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    this.$axios.get("http://localhost:5000/getCourseNameList").then(response => {
      this.courseNameList = JSON.parse(response.data.courseNameList)
    }).catch(error => {
      console.log(error)
    })
    return {
      aNo: this.$route.params.no,
      aName: this.$route.params.name,
      // menu
      activeNameMenu: '2',
      courseNameList: [],
      //grade
      currentCourse: '',
      completedCourseStudent: [],
      selectedCourseStudent: [],
      inputGrade: {
        grade: ''
      },
      currentStudent: null,
      // course management
      activeNameCourse: 'first',
      credit: 1,
      newCourse: {
        cCode: null,
        cName: null,
        credit: null,
        cDept: null,
        tNo: null
      },
      dataTeacher: '',
      teacherSelection: [],
      dataCourse: [],
      courseSelection: '',
      searchCourse: '',
      oldCourse: {},
      editableCourse: true,
      // student management
      activeNameStudent: 'first',
      newStudent: {
        no: null,
        name: null,
        firstName: null,
        lastName: null,
        gender: "male",
        birthday: null,
        department: null,
        username: null,
        password: null
      },
      oldStudent: {},
      editStudent: {},
      dataStudent: [],
      searchStudent: '',
      editableStudent: true,
      // teacher management
      activeNameTeacher: 'first',
      newTeacher:{
        no: null,
        name: null,
        firstName: null,
        lastName: null,
        gender: "male",
        birthday: null,
        department: null,
        username: null,
        password: null
      },
      searchTeacher: '',
      oldTeacher: {},
      editTeacher: {},
      editableTeacher: true
    }
  },
  methods: {
    handleSignOut() {
      this.$router.push('/')
    },
    handleCurrentCourse() {
      this.currentCourse = this.courseNameList[parseInt(this.activeNameMenu.slice(2))]
      this.getCompletedCourseStudent()
      this.getSelectedCourseStudent()
    },
    menuClick(index) {
      this.activeNameMenu = index
      this.activeNameTeacher = 'first'
      this.activeNameStudent = 'first'
      this.activeNameCourse = 'first'
    },
    // ================grade================
    getCompletedCourseStudent() {
      this.$axios.get("http://localhost:5000/getCompletedCourseStudent", {
        params: {
          cName: this.currentCourse
        }
      }).then(response => {
        this.completedCourseStudent = JSON.parse(response.data.completedCourseStudent)
      }).catch(error =>{
        console.log(error)
      })
    },
    getSelectedCourseStudent() {
      this.$axios.get("http://localhost:5000/getSelectedCourseStudent", {
        params: {
          cName: this.currentCourse
        }
      }).then(response => {
        this.selectedCourseStudent = JSON.parse(response.data.selectedCourseStudent)
      }).catch(error =>{
        console.log(error)
      })
    },
    handleStudentSelectChange(val) {
      this.currentStudent = val
    },
    handleSubmitGrade() {
      if (this.currentStudent==null) {
        this.$message.error("Please select a student below.")
      } else if (this.inputGrade.grade>=0 && this.inputGrade.grade<=100) {
        this.$axios.get("http://localhost:5000/inputGrade", {
          params: {
            sNo: this.currentStudent.no,
            grade: this.inputGrade.grade,
            cName: this.currentCourse
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
    // ================course================
    handleCourseClick() {
      if (this.activeNameCourse === "second") {
        this.updateCourse()
        this.updateTeacher()
      }
    },
    // create course
    handleCreateCourse() {
      console.log(this.credit)
      this.newCourse.credit = this.credit.toString()
      console.log(this.newCourse)
      this.$axios.get("http://localhost:5000/createCourse", {
        params: {
          newCourse: this.newCourse
        }
      }).then(response=>{
        if (response.data.Status === "success") {
          this.$message({
            message: "Successfully create course "+response.data.cCode+".",
            type: "success"
          })
          this.handleClearCourse()
        } else if (response.data.Status === "fail") {
          this.$message.error("Course "+response.data.cCode+" exists.")
        }
      }).catch(error =>{
        console.log(error)
        this.$message.error("Input error.")
      })
    },
    handleClearCourse() {
      for(var item in this.newCourse) {
        console.log(item)
        this.newCourse[item] = null
      }
    },
    // get course list and teacher list
    updateCourse() {
      this.$axios.get("http://localhost:5000/getCourse").then(response => {
        this.dataCourse = []
        JSON.parse(response.data.dataCourse).forEach(item => {
          item.edit = false
          this.dataCourse.push(item)
        })
      })
    },
    updateTeacher() {
      this.$axios.get("http://localhost:5000/getTeacher").then(response => {
        this.dataTeacher = []
        JSON.parse(response.data.dataTeacher).forEach(item => {
          item.edit = false
          this.dataTeacher.push(item)
        })
      })
    },
    // add teachers for the course
    handleTeacherSelectChange(selection) {
      this.teacherSelection = []
      selection.forEach(item => {
        this.teacherSelection.push(item.no)
      })
    },
    handleCourseSelectChange(val) {
      this.courseSelection = val
    },
    handleAddTeacher() {
      if (this.teacherSelection.length === 0) {
        this.$message.error("Please select at least one teacher.")
      } else {
        this.$axios.get("http://localhost:5000/addTeacher", {
          params: {
            cCode: this.courseSelection.cCode,
            teacherList: JSON.stringify(this.teacherSelection)
          }
        }).then(response => {
          if (response.data.status === "fail") {
            var failTeacherNo = JSON.parse(response.data.failTeacherNo)
            if (failTeacherNo.length === 1) {
              this.$message.error("Teacher " + failTeacherNo.join(", ") + " has already taught the course.")
            } else {
              this.$message.error("Teacher " + failTeacherNo.join(", ") + " have already taught the course.")
            }
          }
          this.updateCourse();
          this.handleClearAdd();
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // edit course
    handleClearAdd() {
      this.$refs.singleTable.setCurrentRow();
      this.$refs.multipleTableTeacher.clearSelection();
    },
    handleChangeEditStatusCourse(index, row) {
      this.oldCourse.cCode = null
      this.oldCourse.cName = null
      this.oldCourse.credit = null
      this.oldCourse.department = null
      this.oldCourse.tNo = null
      this.dataCourse[index].edit = true
      for (var key in row) {
        this.oldCourse[key] = row[key]
      }
      this.oldCourse.credit = this.oldCourse.credit.toString()
      this.editableCourse = false
    },
    handleCancelEditCourse(index, row) {
      for (var key in this.oldCourse) {
        this.dataCourse[index][key] = this.oldCourse[key]
      }
      this.dataCourse[index].edit = false
      this.editableCourse = true
    },
    handleEditCourse(index, row) {
      row.credit = row.credit.toString()
      this.editCourse = {}
      for (var key in row) {
        if (this.oldCourse[key]!==row[key]) {
          this.editCourse[key] = row[key]
        }
      }
      this.$axios.get("http://localhost:5000/editCourse", {
        params: {
          editCourse: this.editCourse,
          cCode: row.cCode
        }
      }).then(response => {
        if (response.data.Status === "success") {
          this.dataCourse[index].edit = false
          this.updateCourse()
        } else {
          this.$message.error("Input error.")
        }
      }).catch(error => {
        console.log(error)
        this.$message.error("There is something wrong with the system. Please try it later.")
      })
    },
    // delete course
    handleDeleteCourse(index, row) {
      this.$axios.get("http://localhost:5000/deleteCourse", {
        params: {
          course: row
        }
      }).then( response => {
        console.log(response)
        if (response.data.Status === "success") {
          this.$message({
            message: "Delete course successfully.",
            type: "success"
          })
          this.$axios.get("http://localhost:5000/getCourse").then(response => {
            this.dataCourse = JSON.parse(response.data.dataCourse)
          })
        } else {
          this.$message.error("There is something wrong with the system. Please try it later.")
        }
      })
    },
    // ================student================
    updateStudent() {
      this.$axios.get("http://localhost:5000/getStudent").then(response =>{
        this.dataStudent = []
        JSON.parse(response.data.dataStudent).forEach(item => {
          item.edit = false
          this.dataStudent.push(item)
        })
        console.log(this.dataStudent)
      }).catch(error =>{
        console.log(error)
      })
    },
    handleStudentClick() {
      if (this.activeNameStudent==='second') {
        this.updateStudent();
      }
    },
    handleCreateStudent() {
      if (this.newStudent.firstName!==null && this.newStudent.lastName!==null) {
        this.newStudent.name = this.newStudent.firstName + " " + this.newStudent.lastName
      } else {
        this.newStudent.name = null
      }
      delete this.newStudent.firstName
      delete this.newStudent.lastName
      console.log(this.newStudent)
      this.$axios.get("http://localhost:5000/createStudent", {
        params: {
          newStudent: this.newStudent
        }
      }).then(response => {
        if (response.data.status==='success') {
          this.$message({
            message: "Successfully create a student.",
            type: "success"
          })
          this.handleClearStudent();
        } else if (response.data.status==='fail') {
          this.$message.error("Student number "+ this.newStudent.no + " exists.")
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleClearStudent() {
      this.newStudent.no = null
      this.newStudent.name = null
      this.newStudent.firstName = null
      this.newStudent.lastName = null
      this.newStudent.gender = "male"
      this.newStudent.birthday = null
      this.newStudent.department = null
      this.newStudent.username = null
      this.newStudent.password = null
    },
    handleChangeEditStatusStudent(index, row) {
      this.oldStudent.no = null
      this.oldStudent.name = null
      this.oldStudent.gender = null
      this.oldStudent.birthday = null
      this.oldStudent.department = null
      this.oldStudent.username = null
      this.editableStudent = false
      this.dataStudent[index].edit = true
      for (var key in row) {
        this.oldStudent[key] = row[key]
      }
    },
    handleCancelEditStudent(index, row) {
      for (var key in this.oldStudent) {
        this.dataStudent[index][key] = this.oldStudent[key]
      }
      this.dataStudent[index].edit = false
      this.editableStudent = true
    },
    handleEditStudent(index, row) {
      this.editStudent = {}
      for(var item in row) {
        if (this.oldStudent[item] !== row[item]) {
          this.editStudent[item] = row[item]
        }
      }
      console.log(this.editStudent)
      this.$axios.get("http://localhost:5000/editStudent", {
        params: {
          sNo: row.no,
          editStudent: JSON.stringify(this.editStudent)
        }
      }).then(response => {
        if (response.data.status==="success") {
          this.dataStudent[index].edit = false
          this.updateStudent()
        } else {
          this.$message.error("Input error.")
        }
      }).catch(error => {
        console.log(error)
        this.$message.error("There is something wrong with the system. Please try it later.")
      })
    },
    handleDeleteStudent(index, row) {
      this.$axios.get("http://localhost:5000/deleteStudent", {
        params: {
          sNo: row.no
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$message({
            message: "Delete successfully.",
            type: "success"
          })
          this.updateStudent()
        } else if (response.data.status==="fail") {
          this.$message.error("There is something wrong with the system. Please try it later.")
        }
      }).catch(error => {
        console.log(error)
        this.$message.error("Input error.")
      })
    },
    // ================teacher================
    handleTeacherClick() {
      if (this.activeNameTeacher==="second") {
        this.updateTeacher()
      }
    },
    handleCreateTeacher() {
      if (this.newTeacher.firstName!==null && this.newTeacher.lastName!==null) {
        this.newTeacher.name = this.newTeacher.firstName + " " + this.newTeacher.lastName
      } else {
        this.newTeacher.name = null
      }
      delete this.newTeacher.firstName
      delete this.newTeacher.lastName
      this.$axios.get("http://localhost:5000/createTeacher", {
        params: {
          newTeacher: JSON.stringify(this.newTeacher)
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$message({
            message: "Successfully add new teacher.",
            type: "success"
          })
          this.handleClearTeacher()
        } else if (response.data.status === "fail") {
          this.$message.error(this.newTeacher.no+" exists.")
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleClearTeacher() {
      this.newTeacher.no = null
      this.newTeacher.name = null
      this.newTeacher.firstName = null
      this.newTeacher.lastName = null
      this.newTeacher.gender = "male"
      this.newTeacher.birthday = null
      this.newTeacher.department = null
      this.newTeacher.username = null
      this.newTeacher.password = null
    },
    handleChangeEditStatusTeacher(index, row) {
      this.oldTeacher.no = null
      this.oldTeacher.name = null
      this.oldTeacher.gender = null
      this.oldTeacher.birthday = null
      this.oldTeacher.department = null
      this.oldTeacher.username = null
      this.dataTeacher[index].edit = true
      for (var item in row) {
        this.oldTeacher[item] = row[item]
      }
      this.editableTeacher = false
    },
    handleCancelEditTeacher(index, row) {
      console.log(this.oldTeacher)
      for (var key in this.oldTeacher) {
        this.dataTeacher[index][key] = this.oldTeacher[key]
      }
      this.dataTeacher[index].edit = false
      this.editableTeacher = true
    },
    handleEditTeacher(index, row) {
      this.editTeacher = {}
      for (var item in row) {
        if (row[item] !== this.oldTeacher[item]) {
          this.editTeacher[item] = row[item]
        }
      }
      this.$axios.get("http://localhost:5000/editTeacher", {
        params: {
          tNo: row.no,
          editTeacher: JSON.stringify(this.editTeacher)
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.updateTeacher()
          this.editableTeacher = true
        } else if (response.data.status === "fail") {
          this.$message.error("Input Error.")
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleDeleteTeacher(index, row) {
      this.$axios.get("http://localhost:5000/deleteTeacher", {
        params: {
          tNo: row.no
        }
      }).then(response => {
        if (response.data.status==="fail") {
          this.$message.error("There is something wrong with the system. Please try it later.")
        }
        this.updateTeacher()
      }).catch(error =>{
        console.log(error)
      })
    },
  }
}
</script>

<style scope>
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
  /*height: 100%;*/
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
