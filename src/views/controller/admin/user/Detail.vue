<template>
  <div style="margin-bottom: 20px">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员</el-breadcrumb-item>
      <el-breadcrumb-item to="/admin/userManage">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{$route.params.uid}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="detail">
    <el-card>
      <el-form label-width="120" label-position="left">
        <el-form-item label="UID">
          <el-input disabled v-model="form.uid"/>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" placeholder="重置用户密码，留空则不重置" v-model="form.password"/>
        </el-form-item>
        <el-form-item label="黑名单手机号">
          <el-input v-model="form.black_phone"/>
        </el-form-item>
        <el-form-item label="白名单IP">
          <el-input v-model="form.white_ip"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">封禁</el-radio>
            <el-radio :label="2">禁止发信（暂不可用）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="sub" type="primary">提交</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";
export default {
  name: "adminDetail",
  data() {
    return {
      form: {
        uid: this.$route.params.uid,
        username: '',
        password: '',
        black_phone: '',
        white_ip: '',
        status: 0,
      }
    }
  },
  methods: {
    back() {
      history.back()
    },
    sub() {
      request({
        url: "/admin/user/detail/" + this.$route.params.uid,
        method: "post",
        data: {
          username: this.form.username,
          password: this.form.password,
          black_phone: this.form.black_phone,
          white_ip: this.form.white_ip,
          status: this.form.status
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.status === 1) {
          ElNotification({
            title: '成功',
            message: res.data.msg,
            type: 'success',
          })
        } else {
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    init() {
      request({
        url: "/admin/user/detail/" + this.$route.params.uid,
        method: "get",
      }).then(res => {
        if (res.data.status === 1) {
          this.form.username = res.data.data.username
          this.form.white_ip = res.data.data.white_ip
          this.form.black_phone = res.data.data.black_phone
          this.form.status = res.data.data.status
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

<style scoped>

</style>