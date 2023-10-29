<template>
  <div style="margin-bottom: 20px;display: flex;justify-content: space-between">
    <el-breadcrumb separator="/" style="padding-top: 10px">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to="">管理员</el-breadcrumb-item>
      <el-breadcrumb-item>兑换</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="form.show = true">添加兑换码</el-button>
  </div>
  <el-table :data="data">
    <el-table-column label="ID" prop="id" width="70" align="center"/>
    <el-table-column label="兑换码" prop="code" width="180" align="center"/>
    <el-table-column label="额度" prop="quota" align="center" />
    <el-table-column label="创建时间" prop="create_time" align="center" min-width="120" />
    <el-table-column label="使用时间" prop="use_time" align="center" min-width="120"/>
    <el-table-column label="状态" prop="status" align="center">
      <template #default="scope">
        <el-tag type="success" v-if="scope.row.status === 1">已使用</el-tag>
        <el-tag type="info" v-if="scope.row.status === 0">未使用</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="使用者UID" align="center">
      <template #default="scope">
        <span>{{scope.row.use_uid.Int16}}</span>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination style="display: flex;justify-content: center;margin-top: 20px;margin-bottom: 20px" @current-change="init" background layout="prev, pager, next" :page-size="30" :total="nums" />
  <el-dialog v-model="form.show" title="添加兑换码">
    <el-form v-model="form" label-position="left" label-width="85">
      <el-form-item label="可兑换额度">
        <el-input v-model="form.quota" type="number" placeholder="生成的兑换码可兑换的发信额度" />
      </el-form-item>
      <el-form-item label="生成数量">
        <el-input v-model="form.num" type="number" placeholder="生成的兑换码数量" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sub">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";
import moment from "moment";

export default {
  name: "AdminExchange",
  data() {
    return {
      data: [],
      nums: 0,
      form: {
        show: false,
        num: '',
        quota: '',
      }
    }
  },
  methods: {
    init(pages = 1) {
      request({
        url: "/admin/exchange/get",
        method: "post",
        data: {
          "pages": pages,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.status === 1) {
          this.data = res.data.data
          for (let index in this.data) {
            this.data[index].create_time = moment(this.data[index].create_time).format('YYYY-MM-DD HH:mm:ss')
            if (this.data[index].use_time !== null) {
              this.data[index].use_time = moment(this.data[index].use_time).format()
            }
          }
          this.nums = res.data.num
        } else {
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    sub() {
      request({
        url: "/admin/exchange/add",
        method: "post",
        data: {
          "num": this.form.num,
          "quota": this.form.quota,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.status === 1) {
          this.form.num = ''
          this.form.quota = ''
          this.form.show = false
          ElNotification({
            title: '成功',
            message: res.data.msg,
            type: 'success',
          })
          this.init()
        } else {
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="less" scoped>

</style>