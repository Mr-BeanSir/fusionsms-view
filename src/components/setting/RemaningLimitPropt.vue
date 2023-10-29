<template>
  <el-card>
    <div class="remaning-limit-propt">
      <span style="font-weight: bold">剩余额度提示</span>
      <div style="margin-top: 10px;display: flex;justify-content: space-between">
        <div class="select">
          当剩余额度小于
          <el-input type="number" style="width: 60px" v-model="num"/>
          条时（0则不提示），通过短信发送到
          <el-input type="number" style="width: 180px" v-model="phone"/>
          这个手机号
        </div>
        <el-button @click="save" type="primary" style="width: 10%">保存</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";
import 'element-plus/es/components/notification/style/css'

export default {
  name: "RemainingLimitPrompt",
  data() {
    return {
      num: 0,
      phone: "",
    }
  },
  methods: {
    init() {
      request({
        url: "/controller/setting/remainingLimitPrompt",
        method: "get",
      }).then(res => {
        if (res.data.status === 1){
          this.num = res.data.num
          this.phone = res.data.phone
        }else{
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    save() {
      request({
        url: "/controller/setting/remainingLimitPrompt",
        method: "post",
        data: {
          num: this.num,
          phone: this.phone
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
  beforeMount() {
    this.init()
  }
}
</script>

<style lang="less" scoped>
:deep(.el-card) {
  margin-top: 20px;
}
</style>