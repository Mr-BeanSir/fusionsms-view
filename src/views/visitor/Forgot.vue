<template>
  <div class="bg" />
  <div class="content">
    <el-card class="card" style="width: 350px">
      <el-form class="form" ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
        <h2>找回密码</h2>
        <el-form-item label="邮箱" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <template style="display: flex;justify-content: space-between;width: 100%;height: 40px">
            <el-input type="text" style="width: 60%;height: 38px" v-model="form.captcha"/>
            <s-identify @click="refreshCode" :identify-code="identifyCode"></s-identify>
          </template>
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCaptcha">
          <template style="display: flex;justify-content: space-between;width: 100%;">
            <el-input type="text" style="width: 60%" v-model="form.emailCaptcha"/>
            <el-button @click="sendEmailCaptcha" style="width: 38%" type="primary">获取验证码</el-button>
          </template>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" />
        </el-form-item>
        <el-button type="primary" @click="forgot">修改密码</el-button>
      </el-form>
      <div class="opration">
        <router-link class="route" to="login">登录平台</router-link>
        <router-link class="route" to="register">注册账号</router-link>
      </div>
    </el-card>
  </div>
</template>

<script lang="js">
import request from "@/common/request";
import {reactive} from "vue";
import {ElNotification } from "element-plus";
import 'element-plus/es/components/notification/style/css'
import SIdentify from "@/components/common/sidentify.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Forgot",
  components: {SIdentify},
  data() {
    return {
      identifyCode: '',
      identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
      form: reactive({
        "username": '',
        "password": '',
        "captcha": '',
        "emailCaptcha": '',
      }),
      showInvite: false,
      showCode: false,
      rules: {
        username: {
          required: true,trigger: 'blur',message: '请填写邮箱'
        },
        password: {
          required: true, trigger: 'blur', message: '密码不可为空'
        },
        captcha: {
          required: true,trigger: 'blur',message: '验证码不可为空'
        },
        emailCaptcha: {
          required: true,trigger: 'blur',message: '验证码不可为空'
        }
      },
    }
  },
  methods: {
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes,4);
    },
    makeCode (o,l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    },
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    sendEmailCaptcha(){
      if (this.form.captcha !== this.identifyCode){
        ElNotification({
          title: '错误',
          message: '验证码错误',
          type: 'error',
        })
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
        return
      }
      request({
        url: "/user/forgotCaptcha",
        method: "post",
        data: {
          "email": this.form.username,
          "code": this.form.captcha,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      }).then((res) => {
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
          this.identifyCode = ''
          this.makeCode(this.identifyCodes, 4)
        }
      })
    },
    forgot() {
      this.$refs['form'].validate((valid) => {
        if (valid){
          request({
            url: "/user/forgot",
            method: "post",
            data: {
              "username": this.form.username,
              "password": this.form.password,
              "captcha": this.form.captcha,
              "code": this.form.emailCaptcha,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          }).then((res) => {
            if (res.data.status === 1){
              setTimeout(() => {
                location.href = "/login"
              },500)
              ElNotification({
                title: '成功',
                message: "请前往登录",
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
      })
    }
  },
  mounted() {
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  }
}
</script>

<style lang="less" scoped>
.content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  .card {
    .opration {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }
    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    button {
      width: 100%;
    }
  }
}
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2c3e50;
}
</style>
