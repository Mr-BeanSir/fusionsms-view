<template>
  <span style="font-size: 1.2em;font-weight: lighter;margin-bottom: 12px;display: block">SMTP设置</span>
  <el-form v-model="form" label-position="left" label-width="80">
    <el-form-item label="服务器">
      <el-input placeholder="smtp.qq.com:25" v-model="form.server"/>
    </el-form-item>
    <el-form-item label="账号">
      <el-input placeholder="xxxx@qq.com" v-model="form.username"/>
    </el-form-item>
    <el-form-item label="密码/密钥">
      <el-input placeholder="xxxxxxxxx" v-model="form.password"/>
    </el-form-item>
    <el-form-item label="发信昵称">
      <el-input placeholder="云耀科技" v-model="form.nickname"/>
    </el-form-item>
    <el-form-item label="是否是SSL">
      <el-radio-group v-model="form.ssl" style="padding-left: 10px">
        <el-radio :label="0">关</el-radio>
        <el-radio :label="1">开</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="sub">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "AdminSentSetting",
  data() {
    return {
      form: {
        server: '',
        username: '',
        password: '',
        nickname: '',
        ssl: 0,
      }
    }
  },
  methods: {
    init() {
      request({
        url: "/admin/setting/getSent",
        method: "get",
      }).then(res => {
        if (res.data.status === 1){
          this.form.server = res.data.data.smtp_server
          this.form.username = res.data.data.smtp_username
          this.form.password = res.data.data.smtp_password
          this.form.nickname = res.data.data.smtp_nickname
          this.form.ssl = res.data.data.smtp_ssl
        }else{
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
        url: "/admin/setting/setSent",
        method: "post",
        data: {
          server: this.form.server,
          username: this.form.username,
          password: this.form.password,
          nickname: this.form.nickname,
          ssl: this.form.ssl,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.status === 1){
          ElNotification({
            title: '成功',
            message: res.data.msg,
            type: 'success',
          })
        }else{
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