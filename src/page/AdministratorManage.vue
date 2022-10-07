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
          default-active="2"
          width="auto"
          @select="menuClick">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>
              <span>Grade Management</span>
            </template>
          </el-submenu>
          <el-menu-item index="2" @click.native="">
            <i class="el-icon-data-analysis"></i>
            <span>Grade Distribution</span>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-info"></i>
              <span>Information Management</span>
            </template>
            <el-menu-item index="3-1">Course Information</el-menu-item>
            <el-menu-item index="3-2">Student Information</el-menu-item>
            <el-menu-item index="3-3">Teacher Information</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- Course Info Management -->
        <template v-if="activeNameMenu==='3-1'">
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
                :default-sort = "{prop: 'cCode', order: 'ascending'}"
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
                      @click.native.prevent="handleChangeEditStatus(scope.$index, scope.row)"
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
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      aNo: this.$route.params.no,
      aName: this.$route.params.name,
      // menu
      activeNameMenu: '2',
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
      oldCourse: {}
    }
  },
  methods: {
    handleSignOut() {
      this.$router.push('/')
    },
    menuClick(index) {
      this.activeNameMenu = index
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
          item.edit = false;
          this.dataCourse.push(item)
        })
      })
    },
    updateTeacher() {
      this.$axios.get("http://localhost:5000/getTeacher").then(response => {
        console.log(response.data)
        this.dataTeacher = JSON.parse(response.data.dataTeacher)
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
      console.log(this.courseSelection.cCode)
      console.log(this.teacherSelection)
      this.$axios.get("http://localhost:5000/addTeacher", {
        params: {
          cCode: this.courseSelection.cCode,
          teacherList: JSON.stringify(this.teacherSelection)
        }
      }).then(response => {
        if (response.data.Status === "") {

        }
        this.updateCourse();
        this.handleClearAdd();
      }).catch( error =>{
        console.log(error)
      })
    },
    // edit course
    handleClearAdd() {
      this.$refs.singleTable.setCurrentRow();
      this.$refs.multipleTableTeacher.clearSelection();
    },
    handleChangeEditStatus(index, row) {
      this.dataCourse[index].edit = true
      this.oldCourse = JSON.stringify(row)
    },
    handleEditCourse(index, row) {
      console.log(this.oldCourse)
      this.dataCourse[index].edit = false
      this.$axios.get("http://localhost:5000/editCourse", {
        params: {
          oldCourse: this.oldCourse,
          newCourse: JSON.stringify(row)
        }
      }).then(response => {
        if (response.data.Status==="success") {
          this.updateCourse()
        } else {
          this.$message.error("There is something wrong with the system. Please try it later.")
        }
      }).catch(error => {
        console.log(error)
        this.$message.error("Input error.")
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
    }
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

<!--                <Sider hide-trigger :style="{background: '#fff'}">-->
<!--                    <Menu active-name="1" theme="light" width="auto" :open-names="['1']" @on-select="handleGrade">-->
<!--                        <Submenu name="1">-->
<!--                            <template slot="title">-->
<!--                                成绩管理-->
<!--                            </template>-->
<!--                            <MenuItem v-for="(item,index) of dataCourse" :name="item.CNAME" >{{item.CNAME}}</MenuItem>-->
<!--                        </Submenu>-->
<!--                        <MenuItem name="2" @click.native="chooseDistribution()">成绩分布</MenuItem>-->
<!--                        <Submenu name="3">-->
<!--                            <template slot="title">-->
<!--                                维护-->
<!--                            </template>-->
<!--                            <MenuItem name="3-1" @click.native="chooseCourse()">课程信息</MenuItem>-->
<!--                            <MenuItem name="3-2" @click.native="chooseStudent()">学生信息</MenuItem>-->
<!--                            <MenuItem name="3-3" @click.native="chooseTeacher()">教师信息</MenuItem>-->
<!--                        </Submenu>-->
<!--                    </Menu>-->
<!--                    <Divider/>-->
<!--                    <div style="text-align: center">-->
<!--                        <Button type="primary" @click="handleLogOut()">退出</Button>-->
<!--                    </div>-->
<!--                </Sider>-->
<!--                <template v-if="functions === '1'">-->
<!--                    <Layout :style="{padding: '0 24px 24px', height: '610px'}">-->
<!--                        <br>-->
<!--                        <Card>-->
<!--                            <Content :style="{padding: '24px', minHeight: '280px', maxHeight: '400px', background: '#fff'}">-->
<!--                                <p>已完成此课程的学生：</p>-->
<!--                                <Table border max-height="220" :columns="columnsGrade" :data="dataGrade"></Table>-->
<!--                            </Content>-->
<!--                        </Card>-->
<!--                        <br>-->
<!--                        <Card>-->
<!--                            <Content :style="{padding: '24px', minHeight: '280px', maxHeight: '400px', background: '#fff'}">-->
<!--                                <Form inline>-->
<!--                                    <FormItem prop="sno">-->
<!--                                        <Input type="text" v-model="inputGrade.SNO" placeholder="学号"/>-->
<!--                                    </FormItem>-->
<!--                                    <FormItem prop="grade">-->
<!--                                        <Input type="text" v-model="inputGrade.GRADE" placeholder="成绩"/>-->
<!--                                    </FormItem>-->
<!--                                    <FormItem>-->
<!--                                        <Button type="primary" :disabled="!inputGrade.SNO || !inputGrade.GRADE || !course" @click="handleSubmit()">输入成绩</Button>-->
<!--                                    </FormItem>-->
<!--                                </Form>-->
<!--                                <p>选修此课程的学生：</p>-->
<!--                                <Table border max-height="220" :columns="columnsSelected" :data="dataSelected"></Table>-->
<!--                            </Content>-->
<!--                        </Card>-->
<!--                    </Layout>-->
<!--                </template>-->
<!--                <template v-else-if="functions === '2'">-->
<!--                    <Layout :style="{padding: '24px 24px 24px'}">-->
<!--                        <Card>-->
<!--                            <div style="height: 550px">-->
<!--                                <div style="text-align: center">-->
<!--                                    <h1>成绩分布</h1>-->
<!--                                    <img src="./grade.png" alt="成绩分布"/>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </Card>-->
<!--                    </Layout>-->
<!--                </template>-->
<!--                <template v-else-if="functions ==='3-1'">-->
<!--                    <Layout :style="{padding: '0px 24px 24px', height: '610px'}">-->
<!--                        <br>-->
<!--                        <Form inline>-->
<!--                            <FormItem prop="CNO">-->
<!--                                <Input type="text" v-model="newCourse.CNO" placeholder="课程号"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="CNAME">-->
<!--                                <Input type="text" v-model="newCourse.CNAME" placeholder="课程名"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="CREDIT">-->
<!--                                <Input type="text" v-model="newCourse.CREDIT" placeholder="学分"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="CDEPT">-->
<!--                                <Input type="text" v-model="newCourse.CDEPT" placeholder="开课系"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem>-->
<!--                                <Button type="primary" :disabled="!newCourse.CNO" @click="handleCourseNew()">新增</Button>-->
<!--                            </FormItem>-->
<!--                        </Form>-->
<!--                        <Row style="padding:2px" :gutter=50>-->
<!--                            <Col span="11">-->
<!--                                <Card>-->
<!--                                    <Content :style="{padding: '2px', minHeight: '280px', maxHeight: '600px', background: '#fff'}">-->
<!--                                        <div>-->
<!--                                            <p style="display: inline">记录总数：{{dataCourse.length}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>-->
<!--                                            <Button style="display: inline" type="primary" @click="handleCourseDelete()">删除</Button>-->
<!--                                        </div>-->
<!--                                        <br>-->
<!--                                        <Table border size="small" max-height="560" ref="selection" :columns="columnsCourse" :data="dataCourse" @on-selection-change="controlCourse"></Table>-->
<!--                                    </Content>-->
<!--                                </Card>-->
<!--                            </Col>-->
<!--                            <Col span="11">-->
<!--                                <Card>-->
<!--                                    <Content :style="{padding: '2px', minHeight: '280px', maxHeight: '600px', background: '#fff'}">-->
<!--                                        <div>-->
<!--                                            <p>记录总数：{{dataTeacher.length}}</p>-->
<!--                                            <Table border size="small" max-height="580" ref="selection" :columns="columnsTeacher" :data="dataTeacher" @on-selection-change="controlTeacher"></Table>-->
<!--                                        </div>-->
<!--                                    </Content>-->
<!--                                </Card>-->
<!--                            </Col>-->
<!--                        </Row>-->
<!--                    </Layout>-->
<!--                </template>-->
<!--                <template v-else-if="functions === '3-2'">-->
<!--                    <Layout :style="{padding: '0px 24px 24px', height: '610px'}">-->
<!--                        <br>-->
<!--                        <Form inline>-->
<!--                            <FormItem prop="SNO">-->
<!--                                <Input type="text" v-model="newStudent.SNO" placeholder="学号"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="SNAME">-->
<!--                                <Input type="text" v-model="newStudent.SNAME" placeholder="姓名"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="SEX">-->
<!--                                <Input type="text" v-model="newStudent.SEX" placeholder="性别"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="AGE">-->
<!--                                <Input type="text" v-model="newStudent.AGE" placeholder="年龄"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="SDEPT">-->
<!--                                <Input type="text" v-model="newStudent.SDEPT" placeholder="所在系"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="LOGINNO">-->
<!--                                <Input type="text" v-model="newStudent.LOGINNO" placeholder="登录名"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="LOGINPASS">-->
<!--                                <Input type="text" v-model="newStudent.LOGINPASS" placeholder="密码"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem>-->
<!--                                <Button type="primary" :disabled="!newStudent.SNO" @click="handleStudentNew()">新增</Button>-->
<!--                            </FormItem>-->
<!--                        </Form>-->
<!--                        <Card>-->
<!--                            <div style="height: 420px">-->
<!--                                <div>-->
<!--                                    <p style="display: inline">记录总数：{{dataStudent.length}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>-->
<!--                                    <Button style="display: inline" type="primary" :disabled="studentSelected.length === 0" @click="handleStudentDelete()">删除</Button>-->
<!--                                </div>-->
<!--                                <br>-->
<!--                                <Table border max-height="360" ref="selection" :columns="columnsStudent" :data="dataStudent" @on-selection-change="controlStudent"></Table>-->
<!--                            </div>-->
<!--                        </Card>-->
<!--                    </Layout>-->
<!--                </template>-->
<!--                <template v-else-if="functions === '3-3'">-->
<!--                    <Layout :style="{padding: '0px 24px 24px', height: '610px'}">-->
<!--                        <br>-->
<!--                        <Form inline>-->
<!--                            <FormItem prop="TNO">-->
<!--                                <Input type="text" v-model="newTeacher.TNO" placeholder="教师号"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="TNAME">-->
<!--                                <Input type="text" v-model="newTeacher.TNAME" placeholder="教师名"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="TDEPT">-->
<!--                                <Input type="text" v-model="newTeacher.TDEPT" placeholder="所在系"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="TCLASS">-->
<!--                                <Input type="text" v-model="newTeacher.TCLASS" placeholder="所属类别"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="LOGINNO">-->
<!--                                <Input type="text" v-model="newTeacher.LOGINNO" placeholder="登录名"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem prop="LOGINPASS">-->
<!--                                <Input type="text" v-model="newTeacher.LOGINPASS" placeholder="密码"/>-->
<!--                            </FormItem>-->
<!--                            <FormItem>-->
<!--                                <Button type="primary" :disabled="!newTeacher.TNO" @click="handleTeacherNew()">新增</Button>-->
<!--                            </FormItem>-->
<!--                        </Form>-->
<!--                        <Card>-->
<!--                            <div style="height: 420px">-->
<!--                                <div>-->
<!--                                    <p style="display: inline">记录总数：{{dataTeacher.length}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>-->
<!--                                    <Button style="display: inline" type="primary" :disabled="teacherSelected.length === 0" @click="handleTeacherDelete()">删除</Button>-->
<!--                                </div>-->
<!--                                <br>-->
<!--                                <Table border max-height="360" ref="selection" :columns="columnsTeacherBig" :data="dataTeacher" @on-selection-change="controlTeacher"></Table>-->
<!--                            </div>-->
<!--                        </Card>-->
<!--                    </Layout>-->
<!--                </template>-->
<!--            </Layout>-->
<!--        </Layout>-->
<!--    </div>-->
<!--</template>-->
<!--<script>-->
<!--export default {-->
<!--    data () {-->
<!--        return {-->
<!--            functions: '1',-->
<!--            course: '',-->
<!--            dataCourse: this.$route.params.courseInfo,-->
<!--            columnsGrade: [-->
<!--                {-->
<!--                    title: '学号',-->
<!--                    key: 'SNO'-->
<!--                },-->
<!--                {-->
<!--                    title: '成绩',-->
<!--                    key: 'GRADE'-->
<!--                },-->
<!--                {-->
<!--                    title: '绩点',-->
<!--                    key: 'POINT'-->
<!--                }-->
<!--            ],-->
<!--            dataGrade: [],-->
<!--            columnsSelected: [-->
<!--                {-->
<!--                    title: '学号',-->
<!--                    key: 'SNO'-->
<!--                },-->
<!--                {-->
<!--                    title: '姓名',-->
<!--                    key: 'SNAME'-->
<!--                }-->
<!--            ],-->
<!--            dataSelected: [],-->
<!--            inputGrade: {-->
<!--                SNO: '',-->
<!--                GRADE: ''-->
<!--            },-->
<!--            columnsCourse: [-->
<!--                {-->
<!--                    type: 'selection',-->
<!--                    width: 55,-->
<!--                    align: 'center'-->
<!--                },-->
<!--                {-->
<!--                    title: '课程号',-->
<!--                    key: 'CNO',-->
<!--                    width: 70-->
<!--                },-->
<!--                {-->
<!--                    title: '课程名',-->
<!--                    key: 'CNAME',-->
<!--                    width: 110-->
<!--                },-->
<!--                {-->
<!--                    title: '学分',-->
<!--                    key: 'CREDIT',-->
<!--                    width: 55-->
<!--                },-->
<!--                {-->
<!--                    title: '开课系',-->
<!--                    key: 'CDEPT',-->
<!--                    width: 100-->
<!--                },-->
<!--                {-->
<!--                    title: '开课教师号',-->
<!--                    key: 'TNO',-->
<!--                    width: 80-->
<!--                }-->
<!--            ],-->
<!--            columnsTeacher: [-->
<!--                {-->
<!--                    type: 'selection',-->
<!--                    width: 55,-->
<!--                    align: 'center'-->
<!--                },-->
<!--                {-->
<!--                    title: '教师号',-->
<!--                    key: 'TNO',-->
<!--                    width: 80-->
<!--                },-->
<!--                {-->
<!--                    title: '教师名',-->
<!--                    key: 'TNAME',-->
<!--                    width: 100-->
<!--                },-->
<!--                {-->
<!--                    title: '所在系',-->
<!--                    key: 'TDEPT',-->
<!--                    width: 135-->
<!--                },-->
<!--                {-->
<!--                    title: '所属类别',-->
<!--                    key: 'TCLASS',-->
<!--                    width: 100-->
<!--                }-->
<!--            ],-->
<!--            dataTeacher: this.$route.params.teacherInfo,-->
<!--            newCourse: {-->
<!--                CNO: '',-->
<!--                CNAME: '',-->
<!--                CREDIT: '',-->
<!--                CDEPT: '',-->
<!--                TNO: ''-->
<!--            },-->
<!--            courseSelected: '',-->
<!--            teacherSelected: [],-->
<!--            newTeacher: {-->
<!--                TNO: '',-->
<!--                TNAME: '',-->
<!--                TDEPT: '',-->
<!--                TCLASS: '',-->
<!--                LOGINNO: '',-->
<!--                LOGINPASS: ''-->
<!--            },-->
<!--            columnsTeacherBig: [-->
<!--                {-->
<!--                    type: 'selection',-->
<!--                    width: 55,-->
<!--                    align: 'center'-->
<!--                },-->
<!--                {-->
<!--                    title: '教师号',-->
<!--                    key: 'TNO',-->
<!--                },-->
<!--                {-->
<!--                    title: '教师名',-->
<!--                    key: 'TNAME',-->
<!--                },-->
<!--                {-->
<!--                    title: '所在系',-->
<!--                    key: 'TDEPT',-->
<!--                },-->
<!--                {-->
<!--                    title: '所属类别',-->
<!--                    key: 'TCLASS',-->
<!--                },-->
<!--                {-->
<!--                    title: '登录名',-->
<!--                    key: 'LOGINNO'-->
<!--                },-->
<!--                {-->
<!--                    title: '密码',-->
<!--                    key: 'LOGINPASS'-->
<!--                }-->
<!--            ],-->
<!--            columnsStudent: [-->
<!--                {-->
<!--                    type: 'selection',-->
<!--                    width: 55,-->
<!--                    align: 'center'-->
<!--                },-->
<!--                {-->
<!--                    title: '学号',-->
<!--                    key: 'SNO',-->

<!--                },-->
<!--                {-->
<!--                    title: '姓名',-->
<!--                    key: 'SNAME'-->
<!--                },-->
<!--                {-->
<!--                    title: '性别',-->
<!--                    key: 'SEX'-->
<!--                },-->
<!--                {-->
<!--                    title: '年龄',-->
<!--                    key: 'AGE'-->
<!--                },-->
<!--                {-->
<!--                    title: '所在系',-->
<!--                    key: 'SDEPT'-->
<!--                },-->
<!--                {-->
<!--                    title: '登录名',-->
<!--                    key: 'LOGINNO'-->
<!--                },-->
<!--                {-->
<!--                    title: '密码',-->
<!--                    key: 'LOGINPASS'-->
<!--                }-->
<!--            ],-->
<!--            dataStudent: this.$route.params.studentInfo,-->
<!--            studentSelected: [],-->
<!--            newStudent: {-->
<!--                SNO: '',-->
<!--                SNAME: '',-->
<!--                SEX: '',-->
<!--                AGE: '',-->
<!--                SDEPT: '',-->
<!--                LOGINNO: '',-->
<!--                LOGINPASS: ''-->
<!--            }-->
<!--        }-->
<!--    },-->
<!--    methods: {-->
<!--        chooseCourse () {-->
<!--            this.functions = '3-1'-->
<!--            this.teacherSelected = []-->
<!--            // this.$axios.post('http://localhost:5000/api/getcourse', {-->
<!--            // }).then(response => {-->
<!--            //     this.dataCourse = response.data.courseInfo-->
<!--            //     console.log(response)-->
<!--            // })-->
<!--        },-->
<!--        chooseStudent () {-->
<!--            this.functions = '3-2'-->
<!--        },-->
<!--        chooseTeacher () {-->
<!--            this.functions = '3-3'-->
<!--        },-->
<!--        chooseDistribution () {-->
<!--            this.functions = '2'-->
<!--        },-->
<!--        handleGrade (name) {-->
<!--            console.log(name)-->
<!--            var status = false-->
<!--            for (var i=0;i<this.dataCourse.length;i++) {-->
<!--                if (this.dataCourse[i].CNAME === name) {-->
<!--                    status = true-->
<!--                    break-->
<!--                }-->
<!--            }-->
<!--            if (status) {-->
<!--                this.functions = '1'-->
<!--                this.course = name-->
<!--                this.inputGrade.SNO = ''-->
<!--                this.inputGrade.GRADE = ''-->
<!--                this.$axios.post('http://localhost:5000/api/managegrade', {-->
<!--                    CNAME: this.course-->
<!--                }).then(response => {-->
<!--                    console.log(response)-->
<!--                    this.dataGrade = response.data.gradeInfo-->
<!--                    this.dataSelected = response.data.selectInfo-->
<!--                }).catch(error => {-->
<!--                    console.log(error)-->
<!--                })-->
<!--            }-->

<!--        },-->
<!--        handleSubmit () {-->
<!--            this.$axios.post('http://localhost:5000/api/inputgrade', {-->
<!--                SNO: this.inputGrade.SNO,-->
<!--                GRADE: this.inputGrade.GRADE,-->
<!--                CNAME: this.course-->
<!--            }).then(response => {-->
<!--                console.log(response)-->
<!--                if (response.data.status === 'success') {-->
<!--                    this.$Message.success('输入成功！')-->
<!--                    this.dataGrade = response.data.gradeInfo-->
<!--                    this.dataSelected = response.data.selectInfo-->
<!--                    this.inputGrade.SNO = ''-->
<!--                    this.inputGrade.GRADE = ''-->
<!--                } else if (response.data.status === 'grade_fail') {-->
<!--                    this.$Message.error('成绩输入错误！')-->
<!--                } else if (response.data.status === 'sno_fail') {-->
<!--                    this.$Message.error("学号输入错误！")-->
<!--                }-->

<!--            })-->
<!--        },-->
<!--        controlCourse (selection) {-->
<!--            this.courseSelected = selection-->
<!--            console.log(this.courseSelected)-->
<!--        },-->
<!--        controlTeacher (selection) {-->
<!--            this.teacherSelected = selection-->
<!--            console.log(this.teacherSelected)-->
<!--        },-->
<!--        handleCourseNew () {-->
<!--            if (this.teacherSelected.length > 1 || this.teacherSelected.length === 0) {-->
<!--                this.$Message.error("请选择一位老师。")-->
<!--            } else if (this.teacherSelected[0].TNO === 'T0') {-->
<!--                this.$Message.error("请勿选择管理员。")-->
<!--            } else {-->
<!--                this.$axios.post('http://localhost:5000/api/coursenew', {-->
<!--                    course: this.newCourse,-->
<!--                    teacher: this.teacherSelected[0]-->
<!--                }).then(response => {-->
<!--                    if (response.data.status === 'success') {-->
<!--                        this.$Message.success("添加成功。")-->
<!--                        this.newCourse = {-->
<!--                            CNO: '',-->
<!--                            CNAME: '',-->
<!--                            CREDIT: '',-->
<!--                            CDEPT: '',-->
<!--                            TNO: ''-->
<!--                        }-->
<!--                        this.dataCourse = response.data.courseInfo-->
<!--                    } else {-->
<!--                        this.$Message.error("课程号已存在。")-->
<!--                    }-->
<!--                    console.log(response)-->
<!--                })-->
<!--            }-->
<!--        },-->
<!--        handleCourseDelete () {-->
<!--            if (this.courseSelected.length === 0) {-->
<!--                this.$Message.error("请选择至少一门课程。")-->
<!--            } else {-->
<!--                this.$axios.post('http://localhost:5000/api/deletecourse', {-->
<!--                    course: this.courseSelected-->
<!--                }).then(response => {-->
<!--                    this.dataCourse = response.data.courseInfo-->
<!--                    this.$Message.success('删除成功。')-->
<!--                    console.log(response)-->
<!--                })-->
<!--            }-->
<!--        },-->
<!--        handleTeacherNew () {-->
<!--            console.log(this.newTeacher)-->
<!--            this.$axios.post('http://localhost:5000/api/newteacher', {-->
<!--                teacher: this.newTeacher-->
<!--            }).then(response => {-->
<!--                if (response.data.status === 'success') {-->
<!--                    this.$Message.success('添加成功。')-->
<!--                    this.dataTeacher = response.data.teacherInfo-->
<!--                    this.newTeacher = {-->
<!--                        TNO: '',-->
<!--                        TNAME: '',-->
<!--                        TDEPT: '',-->
<!--                        TCLASS: '',-->
<!--                        LOGINNO: '',-->
<!--                        LOGINPASS: ''-->
<!--                    }-->
<!--                } else {-->
<!--                    this.$Message.error('教师号已存在。')-->
<!--                }-->
<!--                console.log(response)-->
<!--            })-->
<!--        },-->
<!--        handleTeacherDelete () {-->
<!--            this.$axios.post('http://localhost:5000/api/deleteteacher', {-->
<!--                teacher: this.teacherSelected-->
<!--            }).then(response => {-->
<!--                console.log(response)-->
<!--                if (response.data.exist.length > 0) {-->
<!--                    this.dataTeacher = response.data.teacherInfo-->
<!--                    var t = response.data.exist[0]-->
<!--                    for (var i=1;i<response.data.exist.length;i++) {-->
<!--                        t = t + ', ' + response.data.exist[i]-->
<!--                    }-->
<!--                    this.$Message.error('无法删除教师' + t + '。')-->
<!--                } else {-->
<!--                    this.$Message.success('删除成功。')-->
<!--                    this.dataTeacher = response.data.teacherInfo-->
<!--                }-->
<!--            })-->
<!--        },-->
<!--        handleStudentNew () {-->
<!--            this.$axios.post('http://localhost:5000/api/newstudent', {-->
<!--                student: this.newStudent-->
<!--            }).then(response => {-->
<!--                if (response.data.status === 'success') {-->
<!--                    this.$Message.success('添加成功。')-->
<!--                    this.dataStudent = response.data.studentInfo-->
<!--                    this.newStudent = {-->
<!--                        SNO: '',-->
<!--                        SNAME: '',-->
<!--                        SEX: '',-->
<!--                        AGE: '',-->
<!--                        SDEPT: '',-->
<!--                        LOGINNO: '',-->
<!--                        LOGINPASS: ''-->
<!--                    }-->
<!--                } else {-->
<!--                    this.$Message.error('学号已存在。')-->
<!--                }-->
<!--                console.log(response)-->
<!--            })-->
<!--        },-->
<!--        controlStudent (selection) {-->
<!--            this.studentSelected = selection-->
<!--            console.log(this.studentSelected)-->
<!--        },-->
<!--        handleStudentDelete () {-->
<!--            this.$axios.post('http://localhost:5000/api/deletestudent', {-->
<!--                student: this.studentSelected-->
<!--            }).then(response => {-->
<!--                console.log(response)-->
<!--                if (response.data.exist.length > 0) {-->
<!--                    this.dataStudent = response.data.studentInfo-->
<!--                    var t = response.data.exist[0]-->
<!--                    for (var i=1;i<response.data.exist.length;i++) {-->
<!--                        t = t + ', ' + response.data.exist[i]-->
<!--                    }-->
<!--                    this.$Message.error('无法删除学生' + t + '。')-->
<!--                } else {-->
<!--                    this.$Message.success('删除成功。')-->
<!--                    this.dataStudent = response.data.studentInfo-->
<!--                }-->
<!--            })-->
<!--        },-->
<!--        handleLogOut () {-->
<!--            this.$router.push({-->
<!--                name: 'App'-->
<!--            })-->
<!--        }-->
<!--    }-->
<!--}-->
<!--</script>-->
<!--<style scoped>-->
<!--.layout{-->
<!--    border: 1px solid #d7dde4;-->
<!--    background: #f5f7f9;-->
<!--    position: relative;-->
<!--    border-radius: 4px;-->
<!--    overflow: hidden;-->
<!--}-->
<!--.layout-logo{-->
<!--    width: 100px;-->
<!--    height: 30px;-->
<!--    background: #5b6270;-->
<!--    border-radius: 3px;-->
<!--    float: left;-->
<!--    position: relative;-->
<!--    top: 15px;-->
<!--    left: 20px;-->
<!--}-->
<!--.layout-nav{-->
<!--    width: 420px;-->
<!--    margin: 0 auto;-->
<!--    margin-right: 20px;-->
<!--}-->
<!--</style>-->
