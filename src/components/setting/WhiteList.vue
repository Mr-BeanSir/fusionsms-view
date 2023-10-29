<template>
  <el-card>
    <div class="white-list">
      <span style="font-weight: bold">白名单设置</span>
      <div style="display: flex;margin: 10px 0;justify-content: space-between">
        <el-input type="text" style="width: 80%" v-model="list"/>
        <el-button @click="save" type="primary" style="width: 10%">保存</el-button>
      </div>
      <span style="color: rgb(122,122,122)">输入源站IP，以英文小写逗号 , 分割，白名单IP不会进入规则过滤，使用GET方式访问接口用户请务必设置白名单</span>
    </div>
  </el-card>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";
import 'element-plus/es/components/notification/style/css'

export default {
  name: "WhiteList",
  data() {
    return {
      list: '',
    }
  },
  methods: {
    init() {
      request({
        url: "/controller/setting/whiteList",
        method: "get",
      }).then(res => {
        if (res.data.status === 1){
          this.list = res.data.data
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
        url: "/controller/setting/whiteList",
        method: "post",
        data: {
          list: this.list
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