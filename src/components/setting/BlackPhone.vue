<template>
  <el-card>
    <div class="white-list">
      <span style="font-weight: bold">黑名单手机号设置</span>
      <div style="display: flex;margin: 10px 0;justify-content: space-between">
        <el-input type="text" style="width: 80%" v-model="phone"/>
        <el-button @click="save" type="primary" style="width: 10%">保存</el-button>
      </div>
      <span style="color: rgb(122,122,122)">输入要拉黑的手机号，以英文小写逗号 , 分割，拉黑的手机号将会被发信接口拦截，不会有日志记录</span>
    </div>
  </el-card>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";
import 'element-plus/es/components/notification/style/css'

export default {
  name: "BlackPhone",
  data() {
    return {
      phone: '',
    }
  },
  methods: {
    init() {
      request({
        url: "/controller/setting/blackPhone",
        method: "get",
      }).then(res => {
        if (res.data.status === 1){
          this.phone = res.data.data
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
        url: "/controller/setting/blackPhone",
        method: "post",
        data: {
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