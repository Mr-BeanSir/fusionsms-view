<template>

  <div style="margin-bottom: 20px">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>兑换</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <el-card style="margin-bottom: 20px">
    <el-form v-model="form" label-width="60" label-position="left">
      <el-form-item label="兑换码">
        <el-input v-model="form.code" style="width: 90%" placeholder="请输入兑换码"/>
        <el-button type="primary" style="margin-left: 25px" @click="exchange">兑换</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <span style="display: block;font-size: 18px;font-weight: lighter;margin-bottom: 10px">兑换记录</span>
  <el-card class="table-card">
    <el-table :data="data" stripe>
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="content" label="兑换内容"/>
      <el-table-column prop="time" label="时间"/>
    </el-table>
  </el-card>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "exchange",
  data() {
    return {
      form: {
        code: '',
      },
      data: [],
    }
  },
  methods: {
    exchange() {
      request({
        url: '/controller/exchange/exchange',
        method: "post",
        data: {
          code: this.form.code
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.status === 1) {
          this.init()
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
        url: '/controller/exchange/get',
        method: "get",
      }).then(res => {
        if (res.data.status === 1) {
          this.data = res.data.data
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
.table-card {
  :deep(.el-card__body) {
    padding: 0;
  }
}
:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>