<template>
  <div class="layout">
    <el-container>
      <el-container>
        <!-- 左侧 -->
        <el-aside hide-trigger :style="{background: '#fff'}">
          <!-- 学生信息 -->
          <ul class="layout-info" style="list-style-type:none">
            <li v-for="(item, index) of studentInfo" :key="index">{{item}}</li>
          </ul>
          <el-divider/>
          <!-- 功能选择 -->
          <el-menu :active-name="activeName" theme="light" width="auto" :open-names="['1']">
            <el-submenu name="1" @click.native="select()">
              <i class="el-icon-edit"></i>
              <span>选课</span>
            </el-submenu>
            <el-submenu name="2" @click.native="showGrade()">
              <i class="el-icon-b=view"></i>
              <span>查看已修课程成绩</span>
            </el-submenu>
          </el-menu>
          <el-divider/>
          <div style="text-align: center">
            <el-button type="primary" @click="handleLogOut()">退出</el-button>
          </div>
        </el-aside>
<!--        <Layout :style="{padding: '24px 24px 24px'}">-->
<!--          <template v-if="isSelect">-->
<!--            &lt;!&ndash; 上方搜索栏 &ndash;&gt;-->
<!--            <Form ref="selectCourseInfo" :inline=true>-->
<!--              <FormItem>-->
<!--                <Input type="text" v-model="inputCNO" placeholder="请输入课程号"/>-->
<!--              </FormItem>-->
<!--              <FormItem>-->
<!--                <Button type="primary" :disabled="!inputCNO" @click="handleSearch()">搜索</Button>-->
<!--              </FormItem>-->
<!--              <FormItem>-->
<!--                <Button type="primary" :disabled="button1IsAble" @click="handleSelect()">选课</Button>-->
<!--              </FormItem>-->
<!--              <FormItem>-->
<!--                <Button type="primary" :disabled="!inputCNO" @click="handleEmpty()">清空</Button>-->
<!--              </FormItem>-->
<!--            </Form>-->
<!--            <div>-->
<!--              &lt;!&ndash; 可选课程 &ndash;&gt;-->
<!--              <Table border ref="selection" height=250 :columns="columnsCourse" :data="dataCourse" @on-selection-change="handleSelectChange"></Table>-->
<!--            </div>-->
<!--            <br>-->
<!--            <div>-->
<!--              <p style="display: inline">已选课程：</p>-->
<!--              <Button style="display: inline" type="primary" :disabled="button2IsAble" @click="handleDrop()">退课</Button>-->
<!--            </div>-->
<!--            <br>-->
<!--            <div>-->
<!--              &lt;!&ndash; 已选课程 &ndash;&gt;-->
<!--              <Table border ref="selection" height=250 :columns="columnsSelected" :data="dataSelected" @on-selection-change="handleDropChange"></Table>-->
<!--            </div>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            <div>-->
<!--              <p>已修课程成绩：</p>-->
<!--              <br>-->
<!--              <Table border height=250 :columns="columnsGrade" :data="dataGrade"></Table>-->
<!--            </div>-->
<!--            <br>-->
<!--            <Card>-->
<!--              <div style="height: 590px">-->
<!--                <h1 align='center'>学生成绩单</h1>-->
<!--                <div align='right'>-->
<!--                  <h2 style="display: inline">{{$route.params.userInfo.SNO}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{$route.params.userInfo.SNAME}}</h2>-->
<!--                  <h2 style="display: inline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{year}}/{{month}}/{{day}}</h2>-->
<!--                </div>-->
<!--                <Table border=false :columns="columnsShow" :data="dataShow"></Table>-->
<!--                <br>-->
<!--                <h2>平均成绩：{{avgGrade}}</h2>-->
<!--              </div>-->
<!--            </Card>-->
<!--          </template>-->
<!--        </Layout>-->
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data () {
    var date = new Date()
    return {
      // 学生信息
      studentInfo: ['学号：' + this.$route.params.userInfo.SNO,
        '姓名：' + this.$route.params.userInfo.SNAME,
        '年龄：' + this.$route.params.userInfo.AGE,
        '性别：' + this.$route.params.userInfo.SEX,
        '所在系：' + this.$route.params.userInfo.SDEPT],
      isSelect: true,					// 功能选择
      activeName: '1',				// 初始功能
      inputCNO: '',						// 搜索框
      button1IsAble: true,
      button2IsAble: true,
      // 可选课程
      columnsCourse: [
        {
          type: 'selection',
          width: 55,
          align: 'center'
        },
        {
          title: '课程号',
          key: 'CNO'
        },
        {
          title: '课程名',
          key: 'CNAME'
        },
        {
          title: '学分',
          key: 'CREDIT'
        },
        {
          title: '开课系',
          key: 'CDEPT'
        },
        {
          title: '开课教师',
          key: 'TNAME'
        }
      ],
      dataCourse: this.$route.params.courseInfo,
      selectCNO: [],					// 待选课程
      // 已选课程
      columnsSelected: [
        {
          type: 'selection',
          width: 55,
          align: 'center'
        },
        {
          title: '课程号',
          key: 'CNO'
        },
        {
          title: '课程名',
          key: 'CNAME'
        },
        {
          title: '学分',
          key: 'CREDIT'
        },
        {
          title: '开课系',
          key: 'CDEPT'
        },
        {
          title: '教师',
          key: 'TNAME'
        }
      ],
      dataSelected: this.$route.params.selectedInfo,
      dropCNO: [],						// 待退课程
      columnsGrade: [
        {
          title: '课程号',
          key: 'CNO'
        },
        {
          title: '课程名',
          key: 'CNAME'
        },
        {
          title: '成绩',
          key: 'GRADE'
        },
        {
          title: '绩点',
          key: 'POINT'
        }
      ],
      dataGrade: [],
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      columnsShow: [
        {
          title: '课程号',
          align: 'center',
          key: 'CNO'
        },
        {
          title: '课程名',
          align: 'center',
          key: 'CNAME'
        },
        {
          title: '成绩',
          align: 'center',
          key: 'GRADE'
        },
        {
          title: '学分',
          align: 'center',
          key: 'CREDIT'
        },
        {
          title: '教师',
          align: 'center',
          key: 'TNAME'
        }
      ],
      dataShow: [],
      avgGrade: 0
    }
  },
  methods: {
    select () {
      this.isSelect = true
    },
    showGrade () {
      this.$axios.post('http://localhost:5000/api/grade', {
        SNO: this.$route.params.userInfo.SNO
      }).then(response => {
        this.dataGrade = response.data.gradeInfo
        this.dataShow = response.data.showInfo
        this.avgGrade = response.data.avgGrade
        console.log(response)
        this.isSelect = false
      }).catch(error => {
        console.log(error)
        this.isSelect = false
      })
    },
    handleSelectChange (selection) {
      // 选课状态改变
      this.selectCNO = selection
      if (selection.length === 0) {
        this.button1IsAble = true
      } else {
        this.button1IsAble = false
      }
    },
    handleSelect () {
      // 选课
      this.$axios.post('http://localhost:5000/api/selectcourse', {
        CNO: this.selectCNO,
        SNO: this.$route.params.userInfo.SNO
      }).then(response => {
        console.log(response)
        if (response.data.fail.length === 0) {
          this.$Message.success('选课成功！')
        } else {
          var failCNO = response.data.fail[0]
          for (var i = 1; i < response.data.fail.length; i++) {
            failCNO = failCNO + '，' + response.data.fail[i]
          }
          this.$Message.error('已选择' + failCNO + '课程！')
        }
        this.updateSelected()
      }).catch(error => {
        console.log(error)
      })
    },
    updateSelected () {
      // 更新已选课程
      this.$axios.post('http://localhost:5000/api/updateselected', {
        SNO: this.$route.params.userInfo.SNO
      }).then(response => {
        console.log(response)
        this.dataSelected = response.data.selectedInfo
      }).catch(error => {
        console.log(error)
      })
    },
    handleDropChange (selection) {
      // 退课状态改变
      this.dropCNO = selection
      if (selection.length === 0) {
        this.button2IsAble = true
      } else {
        this.button2IsAble = false
      }
    },
    handleDrop () {
      // 退课
      this.$axios.post('http://localhost:5000/api/dropcourse', {
        CNO: this.dropCNO,
        SNO: this.$route.params.userInfo.SNO
      }).then(response => {
        this.$Message.success('退课成功！')
        console.log(response)
        this.updateSelected()
      }).catch(error => {
        console.log(error)
      })
    },
    handleSearch () {
      // 搜索课程
      this.$axios.post('http://localhost:5000/api/searchcourse', {
        CNO: this.inputCNO
      }).then(response => {
        console.log(response)
        this.dataCourse = response.data.courseInfo
      }).catch(error => {
        console.log(error)
      })
    },
    handleEmpty () {
      // 清空搜索框
      this.inputCNO = ''
      this.dataCourse = this.$route.params.courseInfo
    },
    handleLogOut () {
      this.$router.push({
        name: 'App'
      })
    }
  }
}
</script>
<style scoped>
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo{
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav{
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-info{
  margin: 20px;
}
</style>
