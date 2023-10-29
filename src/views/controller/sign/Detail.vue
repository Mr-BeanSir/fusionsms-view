<template>
  <div class="header">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name: 'signList'}">签名列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{signData.content}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="padding: 20px;margin-top: 20px" body-style="display: flex;justify-content: space-between">
      <el-input v-model="templates" style="width:70%" type="textarea" :rows="5" placeholder="添加报备模板，支持批量添加，每行一个。无需添加签名头，程序会自动添加&#10;示例：您的验证码为：@,5分钟有效，请勿泄露他人！" />
      <el-button @click="addTemplates" type="primary" style="height: 115px;width: 25%;font-size: 32px;">
        添加
      </el-button>
    </el-card>
  </div>
  <div class="sign-detail">
    <el-card>
      <el-table v-loading="loading.list" :data="signData.templates" stripe style="width: 100%">
        <el-table-column align="center" prop="tid" label="模板ID" width="80" />
        <el-table-column align="center" prop="content" label="模板内容" />
        <el-table-column align="center" label="状态">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === 1">通过</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 2">拒绝</el-tag>
            <el-tag type="warning" v-if="scope.row.status === 0">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="reason" label="审核理由">
          <template #default="scope">
            {{scope.row.reason}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="管理" fixed="right" width="160">
          <template #default="scope">
            <el-button @click="deleteTemplate(scope.row.tid,scope.row.super_tid)" size="small" type="danger">删除模板</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Detail",
  data() {
    return {
      templates: '',
      signData: {
        content: '',
        templates: [],
      },
      loading: {
        list: true,
        button: false,
      }
    }
  },
  methods: {
    getInit() {
      request({
        url: "/controller/getSign/" + this.$route.params.sid,
        method: "get",
      }).then(res => {
        this.loading.list = false
        if (res.data.status === 1){
          this.signData.templates = res.data.data
        }else{
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    getContent() {
      request({
        url: "/controller/getSignContent/" + this.$route.params.sid,
        method: "get",
      }).then(res => {
        this.loading.list = false
        if (res.data.status === 1){
          this.signData.content = res.data.content
        }else{
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    addTemplates() {
      request({
        url: "/controller/addSignTemplate",
        method: "post",
        data: {
          "sid": this.$route.params.sid,
          "content": this.templates,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        this.loading.list = false
        if (res.data.status === 1){
          this.getInit()
          this.templates = ''
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
    },
    deleteTemplate(tid,super_tid) {
      request({
        url: "/controller/deleteSignTemplate",
        method: "post",
        data: {
          "tid": tid,
          "super_tid": super_tid,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        this.loading.list = false
        if (res.data.status === 1){
          this.getInit()
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
    },
  },
  mounted() {
    this.getInit()
    this.getContent()
  }
}
</script>

<style lang="less" scoped>
.sign-detail {
  margin-top: 20px;
}
:deep(.el-card__body){
  padding: 0;
}
</style>