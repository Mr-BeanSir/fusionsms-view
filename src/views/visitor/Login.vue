<template>
  <div class="bg">

  </div>
  <div class="content">
    <el-card class="card" style="width: 350px">
      <el-form class="form" ref="form" :model="form" :rules="rules" label-width="66px" label-position="left">
        <h2>登录</h2>
        <el-form-item label="邮箱" prop="username">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"/>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <template style="display: flex;justify-content: space-between;width: 100%;height: 40px">
            <el-input type="text" style="width: 60%;height: 38px" v-model="form.captcha"/>
            <s-identify @click="refreshCode" :identify-code="identifyCode"></s-identify>
          </template>
        </el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form>
      <div class="opration">
        <router-link class="route" to="forgot">找回密码</router-link>
        <router-link class="route" to="register">注册账号</router-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";
import {reactive} from "vue";
import 'element-plus/es/components/notification/style/css'
import SIdentify from "@/components/common/sidentify.vue";


export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  components: {SIdentify},
  data() {
    return {
      form: reactive({
        "username": '',
        "password": '',
        "captcha": '',
      }),
      rules: {
        username: {
          required: true, trigger: 'blur', message: '请填写用户名'
        },
        password: {
          required: true, trigger: 'blur', message: '密码不可为空'
        },
        captcha: {
          required: true, trigger: 'blur', message: '验证码不可为空'
        }
      },
      identifyCode: '',
      identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
    }
  },
  methods: {
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    login() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.captcha !== this.identifyCode) {
            ElNotification({
              title: '错误',
              message: '验证码错误',
              type: 'error',
            })
            return
          }
          this.identifyCode = ''
          this.makeCode(this.identifyCodes, 4)
          request({
            url: "/user/login",
            method: "post",
            data: {
              "username": this.form.username,
              "password": this.form.password,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }).then((res) => {
            if (res.data.status === 1) {
              let token = res.data.token
              localStorage.setItem("token", token)
              setTimeout(() => {
                this.$router.push({
                  path: "index",
                })
              }, 500)
              ElNotification({
                title: '登录成功',
                message: '稍等自动跳转',
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
