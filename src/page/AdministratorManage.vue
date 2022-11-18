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
            <el-tab-pane label="Add New Course" name="first"></el-tab-pane>
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
                <el-col :span="14">
                  <el-form :inline="true" :model="courseSearchForm" size="small">
                    <el-form-item>
                      <el-input v-model="courseSearchForm.courseCode" placeholder="Course Code" size="small"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="searchCourse" circle size="small">
                        <el-icon class="el-icon-search"></el-icon>
                      </el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary"
                      @click="handleAddTeacher">Add Teacher</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button plain @click="handleClearAdd">Clear</el-button>
                    </el-form-item>
                  </el-form>
                  <el-table
                    ref="singleTable"
                    :data="dataCourse"
                    highlight-current-row
                    @current-change="handleCourseSelectChange"
                    empty-text="No course data."
                    style="width: 100%">
                    <el-table-column fixed prop="cCode" label="Course Code" width="120"></el-table-column>
                    <el-table-column prop="cName" label="Course Name" width="150">
                      <template slot-scope="scope">
                        <span v-show="!scope.row.edit">{{scope.row.cName}}</span>
                        <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.cName"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="credit" label="Unit" width="60">
                      <template slot-scope="scope">
                        <span v-show="!scope.row.edit">{{scope.row.credit}}</span>
                        <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.credit"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="cDept" label="Department" width="150">
                      <template slot-scope="scope">
                        <span v-show="!scope.row.edit">{{scope.row.cDept}}</span>
                        <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.cDept"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="tNo" label="Teacher No" width="100"></el-table-column>
                    <el-table-column fixed="right" label="" width="150" align="center">
                      <template slot-scope="scope">
                        <el-button
                          v-show="!scope.row.edit"
                          type="primary"
                          icon="el-icon-edit"
                          circle
                          :disabled="!editableCourse"
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
                  <el-pagination
                    v-show="this.dataCourse!==''"
                    small
                    layout="prev, pager, next"
                    :page-size="pageSizeLarge"
                    :pager-count="5"
                    :total="pageCountCourse"
                    @current-change="handleCurrentChangeCourse">
                  </el-pagination>
                </el-col>
                <el-col :span="10">
                  <el-form :inline="true" :model="teacherSearchForm" size="small">
                    <el-form-item>
                      <el-input v-model="teacherSearchForm.teacherName" placeholder="Teacher Name" size="small"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="searchTeacher" circle size="small">
                        <el-icon class="el-icon-search"></el-icon>
                      </el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button plain @click="teacherSearchForm.teacherName=''; updateTeacher()" size="small">Clear</el-button>
                    </el-form-item>
                  </el-form>
                  <el-table
                    ref="multipleTableTeacher"
                    @selection-change="handleTeacherSelectChange"
                    :data="dataTeacher"
                    empty-text="No teacher data. Please add a teacher first."
                    style="width: 100%">
                    <el-table-column fixed type="selection" width="55"></el-table-column>
                    <el-table-column fixed prop="no" label="Teacher No"></el-table-column>
                    <el-table-column fixed prop="name" label="Name"></el-table-column>
                    <el-table-column prop="department" label="Department" width="150"></el-table-column>
                  </el-table>
                  <el-pagination
                    v-show="this.dataTeacher!==''"
                    small
                    layout="prev, pager, next"
                    :page-size="pageSizeLarge"
                    :pager-count="5"
                    :total="pageCountTeacher"
                    @current-change="handleCurrentChangeTeacher">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>
          </template>
        </template>
        <!-- Student Info Management -->
        <template v-if="activeNameMenu==='2-2'">
          <el-tabs v-model="activeNameStudent" @tab-click="handleStudentClick">
            <el-tab-pane label="Add New Student" name="first"></el-tab-pane>
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
              <el-form :inline="true" :model="StudentSearchForm" size="small">
                <el-form-item>
                  <el-input v-model="StudentSearchForm.studentName" placeholder="Student Name" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchStudent" circle size="small">
                    <el-icon class="el-icon-search"></el-icon>
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button plain @click="StudentSearchForm.studentName=''; updateStudent()" size="small">Clear</el-button>
                </el-form-item>
              </el-form>
              <el-table
                :data="dataStudent"
                empty-text="No student data."
                style="width: 100%">
                <el-table-column prop="no" label="Student No" width="120"></el-table-column>
                <el-table-column prop="name" label="Name">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.name}}</span>
                    <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="gender" label="Gender" width="120">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit">{{scope.row.gender}}</span>
                    <el-select v-show="scope.row.edit" v-model="scope.row.gender" size="small">
                      <el-option
                        v-for="item in optionsGender"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
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
                  <template slot-scope="scope">
                    <el-button
                      v-show="!scope.row.edit"
                      type="primary"
                      icon="el-icon-edit"
                      circle
                      :disabled="!editableStudent"
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
              <el-pagination
                v-show="this.dataStudent!==''"
                small
                layout="prev, pager, next"
                :page-size="pageSizeLarge"
                :pager-count="5"
                :total="pageCountStudent"
                @current-change="handleCurrentChangeStudent">
              </el-pagination>
            </div>
          </template>
        </template>
        <!-- Teacher Info Management -->
        <template v-if="activeNameMenu==='2-3'">
          <el-tabs v-model="activeNameTeacher" @tab-click="handleTeacherClick">
            <el-tab-pane label="Add New Teacher" name="first"></el-tab-pane>
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
              <el-form :inline="true" :model="teacherSearchForm" size="small">
                <el-form-item>
                  <el-input v-model="teacherSearchForm.teacherName" placeholder="Teacher Name" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchTeacher" circle size="small">
                    <el-icon class="el-icon-search"></el-icon>
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button plain @click="teacherSearchForm.teacherName=''; updateTeacher()" size="small">Clear</el-button>
                </el-form-item>
              </el-form>
              <el-table
                :data="dataTeacher"
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
                    <el-select v-show="scope.row.edit" v-model="scope.row.gender" size="small">
                      <el-option
                        v-for="item in optionsGender"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
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
              <el-pagination
                v-show="this.dataTeacher!==''"
                small
                layout="prev, pager, next"
                :page-size="pageSizeLarge"
                :pager-count="5"
                :total="pageCountTeacher"
                @current-change="handleCurrentChangeTeacher">
              </el-pagination>
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
    this.$axios({
      method: 'get',
      url: "/courseName"
    }).then(response => {
      this.courseNameList = response.data
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
      dataTeacher: [],
      teacherSelection: [],
      dataCourse: [],
      courseSelection: null,
      oldCourse: {},
      editableCourse: true,
      courseSearchForm: {
        courseCode: ''
      },
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
      editableStudent: true,
      StudentSearchForm: {
        studentName: ''
      },
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
      oldTeacher: {},
      editTeacher: {},
      editableTeacher: true,
      teacherSearchForm: {
        teacherName: ''
      },
      pageSize: 4,
      pageSizeLarge: 8,
      pageCountTeacher: 0,
      pageCountCourse: 0,
      pageCountStudent: 0,
      currentPageCourse: 1,
      currentPageStudent: 1,
      currentPageTeacher: 1,
      optionsGender: [{
        value: 'male',
        label: 'male'
      }, {
        value: 'female',
        label: 'female'
      }]
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
      this.$axios({
        method: 'get',
        url: '/completedCourseStudent/'+this.currentCourse
      }).then(response => {
        this.completedCourseStudent = response.data
      }).catch(error =>{
        console.log(error)
      })
    },
    getSelectedCourseStudent() {
      this.$axios({
        method: 'get',
        url: '/selectedCourseStudent/'+this.currentCourse
      }).then(response => {
        this.selectedCourseStudent = response.data
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
        this.$axios({
          method: 'post',
          url: '/grade/'+this.currentStudent.no+"/"+this.inputGrade.grade+"/"+this.currentCourse,
          params: {
            _method: 'put'
          }
        }).then(response => {
          if (response.data === "success") {
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
        this.currentPageCourse = 1
        this.updateCourse()
        this.updateTeacher()
      }
    },
    // create course
    handleCreateCourse() {
      this.newCourse.credit = this.credit.toString()
      this.$axios({
        method: 'post',
        url: '/course/'+JSON.stringify(this.newCourse)
      }).then(response=>{
        if (response.data === "success") {
          this.$message({
            message: "Successfully create course "+this.newCourse.cCode+".",
            type: "success"
          })
          this.handleClearCourse()
        } else if (response.data === "fail") {
          this.$message.error("Course "+this.newCourse.cCode+" exists.")
        }
      }).catch(error =>{
        console.log(error)
        this.$message.error("Input error.")
      })
    },
    handleClearCourse() {
      for(const item in this.newCourse) {
        this.newCourse[item] = null
      }
    },
    // get course list and teacher list
    updateCourse() {
      this.$axios({
        method: 'get',
        url: '/courseNum'
      }).then(response => {
        this.pageCountCourse = JSON.parse(response.data)
      })
      this.$axios({
        method: 'get',
        url: '/course/'+this.currentPageCourse+'/'+this.pageSizeLarge
      }).then(response => {
        this.dataCourse = []
        response.data.forEach(item => {
          item.edit = false
          this.dataCourse.push(item)
        })
      })
    },
    handleCurrentChangeCourse(currentPage) {
      this.currentPageCourse = currentPage
      if (this.courseSearchForm.courseCode === '') {
        this.$axios({
          method: 'get',
          url: '/course/'+currentPage+'/'+this.pageSizeLarge
        }).then(response => {
          this.dataCourse = []
          response.data.forEach(item => {
            item.edit = false
            this.dataCourse.push(item)
          })
        })
      } else {
        this.$axios({
          method: 'get',
          url: '/course/'+this.courseSearchForm.courseCode+'/'+currentPage+'/'+this.pageSizeLarge
        }).then(response => {
          this.dataCourse = response.data
        }).catch(error => {
          console.log(error)
        })
      }
    },
    searchCourse() {
      this.currentPageCourse = 1
      this.$axios({
        method: 'get',
        url: '/courseNum/'+this.courseSearchForm.courseCode
      }).then(response => {
        console.log(response.data)
        this.pageCountCourse = JSON.parse(response.data)
      })
      this.$axios({
        method: 'get',
        url: '/course/'+this.courseSearchForm.courseCode+'/'+this.currentPageCourse+'/'+this.pageSizeLarge
      }).then(response => {
        this.dataCourse = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    updateTeacher() {
      this.$axios({
        method: 'get',
        url: '/teacherNum'
      }).then(response => {
        this.pageCountTeacher = JSON.parse(response.data)
      })
      this.$axios({
        method: 'get',
        url: '/teacher/'+this.currentPageTeacher+'/'+this.pageSizeLarge
      }).then(response => {
        this.dataTeacher = []
        response.data.forEach(item => {
          item.edit = false
          this.dataTeacher.push(item)
        })
      })
    },
    handleCurrentChangeTeacher(currentPage) {
      this.currentPageTeacher = currentPage
      if (this.teacherSearchForm.teacherName === '') {
        this.$axios({
          method: 'get',
          url: '/teacher/'+currentPage+'/'+this.pageSizeLarge
        }).then(response => {
          this.dataTeacher = []
          response.data.forEach(item => {
            item.edit = false
            this.dataTeacher.push(item)
          })
        })
      } else {
        this.$axios({
          method: 'get',
          url: '/teacher/'+this.teacherSearchForm.teacherName+'/'+currentPage+'/'+this.pageSizeLarge
        }).then(response => {
          this.dataTeacher = []
          response.data.forEach(item => {
            item.edit = false
            this.dataTeacher.push(item)
          })
        })
      }
    },
    searchTeacher() {
      this.$axios({
        method: 'get',
        url: '/teacher/'+this.teacherSearchForm.teacherName+'/1/'+this.pageSizeLarge
      }).then(response => {
        this.dataTeacher = []
        response.data.forEach(item => {
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
      } else if (this.courseSelection === null) {
        this.$message.error("Please select a course.")
      } else {
        this.$axios({
          method: 'post',
          params: {
            _method: 'put'
          },
          url: '/addTeacher/'+this.courseSelection.cCode+'/'+JSON.stringify(this.teacherSelection),
        }).then(response => {
          if (response.data === "success") {
            this.$message({
              message: "Add teacher successfully",
              type: "success"
            })
          } else {
            let failTeacherNo = response.data
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
      this.$refs.singleTable.clearSelection();
      this.$refs.multipleTableTeacher.clearSelection();
      this.courseSearchForm.courseCode = ''
      this.teacherSearchForm.teacherName = ''
      this.currentPageCourse = 1
      this.updateCourse()
      this.updateTeacher()
    },
    handleChangeEditStatusCourse(index, row) {
      this.oldCourse["cCode"] = null
      this.oldCourse["cName"] = null
      this.oldCourse["credit"] = null
      this.oldCourse["department"] = null
      this.oldCourse["tNo"] = null
      this.dataCourse[index]["edit"] = true
      for (const key in row) {
        this.oldCourse[key] = row[key]
      }
      this.editableCourse = false
    },
    handleCancelEditCourse(index, row) {
      for (const key in this.oldCourse) {
        this.dataCourse[index][key] = this.oldCourse[key]
      }
      this.dataCourse[index]["edit"] = false
      this.editableCourse = true
    },
    handleEditCourse(index, row) {
      let flag = false;
      for (const key in row) {
        if (this.oldCourse[key]!==row[key]) {
          flag = true;
          break
        }
      }
      if (flag) {
        this.$axios({
          method: 'post',
          params: {
            _method: 'put'
          },
          url: '/course/'+JSON.stringify(row)
        }).then(response => {
          if (response.data === "success") {
            this.dataCourse[index].edit = false
            this.editableCourse = true
            this.updateCourse()
          } else {
            this.$message.error("Input error.")
          }
        }).catch(error => {
          console.log(error)
          this.$message.error("There is something wrong with the system. Please try it later.")
        })
      } else {
        this.$message.error("Nothing is changed.")
      }
    },
    // delete course
    handleDeleteCourse(index, row) {
      this.$axios({
        method: 'post',
        params: {
          _method: 'delete'
        },
        url: '/course/'+row.cCode+'/'+row.tNo
      }).then( response => {
        if (response.data === "success") {
          this.$message({
            message: "Delete course successfully.",
            type: "success"
          })
          this.updateCourse()
        } else if (response.data === "fail") {
          this.$message.error("Course "+ row["cCode"] + " has at least one student.")
        }
      })
    },
    // ================student================
    updateStudent() {
      this.$axios({
        method: 'get',
        url: '/studentNum'
      }).then(response =>{
        this.pageCountStudent = JSON.parse(response.data)
      })
      this.$axios({
        method: 'get',
        url: '/student/'+this.currentPageStudent+'/'+this.pageSizeLarge
      }).then(response =>{
        this.dataStudent = []
        response.data.forEach(item => {
          item.edit = false
          this.dataStudent.push(item)
        })
      }).catch(error =>{
        console.log(error)
      })
      this.editableStudent=true
    },
    handleCurrentChangeStudent(currentPage) {
      this.currentPageStudent = currentPage
      if (this.StudentSearchForm.studentName === '') {
        this.$axios({
          method: 'get',
          url: '/student/'+this.currentPageStudent+'/'+this.pageSizeLarge
        }).then(response => {
          this.dataStudent = []
          response.data.forEach(item => {
            item.edit = false
            this.dataStudent.push(item)
          })
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$axios({
          method: 'get',
          url: '/student/'+this.StudentSearchForm.studentName+'/'+currentPage+'/'+this.pageSizeLarge
        }).then(response =>{
          this.dataStudent = []
          JSON.parse(response.data.dataStudent).forEach(item => {
            item.edit = false
            this.dataStudent.push(item)
          })
        }).catch(error =>{
          console.log(error)
        })
      }
    },
    searchStudent() {
      this.$axios({
        method: 'get',
        url: '/studentNum/'+this.StudentSearchForm.studentName
      }).then(response => {
        this.pageCountStudent = JSON.parse(response.data)
      })
      this.$axios({
        method: 'get',
        url: '/student/'+this.StudentSearchForm.studentName+'/1/'+this.pageSizeLarge
      }).then(response =>{
        this.dataStudent = []
        response.data.forEach(item => {
          item.edit = false
          this.dataStudent.push(item)
        })
      }).catch(error =>{
        console.log(error)
      })
    },
    handleStudentClick() {
      if (this.activeNameStudent==='second') {
        this.currentPageStudent = 1
        this.updateStudent();
      }
    },
    handleCreateStudent() {
      if (this.newStudent.firstName!==null && this.newStudent.lastName!==null) {
        this.newStudent.name = this.newStudent.firstName + " " + this.newStudent.lastName
      } else {
        this.newStudent.name = null
      }
      this.$axios({
        method: 'post',
        url: '/student/'+JSON.stringify(this.newStudent)
      }).then(response => {
        if (response.data==='success') {
          this.$message({
            message: "Successfully create a student.",
            type: "success"
          })
          this.handleClearStudent();
        } else if (response.data==='fail') {
          this.$message.error("Student number "+ this.newStudent.no + " exists.")
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleClearStudent() {
      this.newStudent["no"] = null
      this.newStudent["name"] = null
      this.newStudent["firstName"] = null
      this.newStudent["lastName"] = null
      this.newStudent["gender"] = "male"
      this.newStudent["birthday"] = null
      this.newStudent["department"] = null
      this.newStudent["username"] = null
      this.newStudent["password"] = null
    },
    handleChangeEditStatusStudent(index, row) {
      this.oldStudent["no"] = null
      this.oldStudent["name"] = null
      this.oldStudent["gender"] = null
      this.oldStudent["birthday"] = null
      this.oldStudent["department"] = null
      this.oldStudent["username"] = null
      this.editableStudent = false
      this.dataStudent[index]["edit"] = true
      for (var key in row) {
        this.oldStudent[key] = row[key]
      }
    },
    handleCancelEditStudent(index, row) {
      for (const key in this.oldStudent) {
        this.dataStudent[index][key] = this.oldStudent[key]
      }
      this.dataStudent[index]["edit"] = false
      this.editableStudent = true
    },
    handleEditStudent(index, row) {
      let flag = false
      for(const item in row) {
        if (this.oldStudent[item] !== row[item]) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$axios({
          method: 'post',
          params: {
            _method: 'put'
          },
          url: '/student/'+JSON.stringify(row)
        }).then(response => {
          if (response.data === "success") {
            this.dataStudent[index]["edit"] = false
            this.updateStudent()
          } else {
            this.$message.error("Input error.")
          }
        }).catch(error => {
          console.log(error)
          this.$message.error("There is something wrong with the system. Please try it later.")
        })
      } else {
        this.$message.error("Nothing is changed.")
      }
    },
    handleDeleteStudent(index, row) {
      this.$axios({
        method: 'post',
        params: {
          _method: 'delete'
        },
        url: '/student/'+row.no
      }).then(response => {
        if (response.data === "success") {
          this.$message({
            message: "Delete successfully.",
            type: "success"
          })
          this.updateStudent()
        } else if (response.data==="fail") {
          this.$message.error("Student "+ row["no"] + " has taken at least one course.")
        }
      }).catch(error => {
        console.log(error)
        this.$message.error("Input error.")
      })
    },
    // ================teacher================
    handleTeacherClick() {
      if (this.activeNameTeacher==="second") {
        this.currentPageTeacher = 1
        this.updateTeacher()
      }
    },
    handleCreateTeacher() {
      if (this.newTeacher.firstName!==null && this.newTeacher.lastName!==null) {
        this.newTeacher.name = this.newTeacher.firstName + " " + this.newTeacher.lastName
      } else {
        this.newTeacher.name = null
      }
      this.$axios({
        method: 'post',
        url: '/teacher/'+JSON.stringify(this.newTeacher)
      }).then(response => {
        if (response.data === "success") {
          this.$message({
            message: "Successfully add new teacher.",
            type: "success"
          })
          this.handleClearTeacher()
        } else if (response.data === "fail") {
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
      this.oldTeacher["no"] = null
      this.oldTeacher["name"] = null
      this.oldTeacher["gender"]= null
      this.oldTeacher["birthday"] = null
      this.oldTeacher["department"] = null
      this.oldTeacher["username"] = null
      this.dataTeacher[index]["edit"] = true
      for (const item in row) {
        this.oldTeacher[item] = row[item]
      }
      this.editableTeacher = false
    },
    handleCancelEditTeacher(index, row) {
      for (const key in this.oldTeacher) {
        this.dataTeacher[index][key] = this.oldTeacher[key]
      }
      this.dataTeacher[index].edit = false
      this.editableTeacher = true
    },
    handleEditTeacher(index, row) {
      let flag = false;
      for (const item in row) {
        if (row[item] !== this.oldTeacher[item]) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$axios({
          method: 'post',
          params: {
            _method: 'put'
          },
          url: '/teacher/'+JSON.stringify(row)
        }).then(response => {
          if (response.data === "success") {
            this.updateTeacher()
            this.editableTeacher = true
          } else if (response.data === "fail") {
            this.$message.error("Input Error.")
          }
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$message.error("Nothing is changed.")
      }
    },
    handleDeleteTeacher(index, row) {
      this.$axios({
        method: 'post',
        params: {
          _method: 'delete'
        },
        url: '/teacher/'+row.no
      }).then(response => {
        if (response.data==="fail") {
          this.$message.error("Teacher "+row.no+" has at least one course.")
        } else {
          this.$message({
            message: "Delete successfully.",
            type: "success"
          })
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
