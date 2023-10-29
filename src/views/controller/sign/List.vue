<template>
  <div class="header">
    <div class="left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>签名列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <el-button type="primary" @click="signOperation.show = true">
        添加签名头
      </el-button>
    </div>
  </div>
  <div class="sign-list">
    <el-card>
      <el-table v-loading="signListLoading" :data="signList" stripe style="width: 100%">
        <el-table-column align="center" prop="id" label="签名ID" width="80" />
        <el-table-column align="center" prop="sign" label="签名" />
        <el-table-column align="center" prop="key" label="密钥" min-width="180"/>
        <el-table-column align="center" label="状态">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === 1">通过</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 2">拒绝</el-tag>
            <el-tag type="warning" v-if="scope.row.status === 0">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="管理" fixed="right" width="160">
          <template #default="scope">
            <el-button @click="$router.push({name: 'signDetail',params: {sid: scope.row.id}})" size="small" type="primary">
              管理
            </el-button>
            <el-button @click="resetKey(scope.row.key)" size="small" type="warning">重置密钥</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <el-dialog title="添加签名头" width="535" v-model="signOperation.show">
    <el-form ref="addSignRef" :rules="signOperation.rules" :model="signOperation.data">
      <el-form-item label="签名头" prop="sign">
        <el-input type="text" v-model="signOperation.data.sign" placeholder="【云耀科技】"></el-input>
      </el-form-item>
    </el-form>
    <div style="display: flex;justify-content: end">
      <span/>
      <el-button @click="addSign" type="primary">添加</el-button>
      <el-button @click="signOperation.show = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";
import 'element-plus/es/components/notification/style/css'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "List",
  data() {
    return {
      signListLoading: true,
      signList: [
        {
          id: 1,
          sign: "【测试】",
          status: 0,
        }
      ],
      signOperation: {
        show: false,
        rules: {
          sign: [
            {required: true,message: "签名头不能为空",trigger: "blur"},
            {validator: (rule,value,callback) => {
              if (!/【/.test(value)){
                callback(new Error("请包含【】！"))
              }
              callback()
            },trigger: "blur"}
          ]
        },
        data: {
          sign: '',
        }
      }
    }
  },
  methods: {
    addSign() {
      let el = this.$refs.addSignRef
      el.validate((valid) => {
        if (valid === true){
          request({
            url: "/controller/addSign",
            method: "post",
            data: {
              "content": this.signOperation.data.sign,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }).then((res) => {
            if (res.data.status === 1) {
              this.signOperation.show = false
              this.signOperation.data = {}
              this.getSignList()
              ElNotification({
                title: '成功',
                message: '签名头添加成功',
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
    },
    getSignList() {
      this.signListLoading = true
      request({
        url: "/controller/getSignList",
        method: "get",
      }).then(res => {
        this.signListLoading = false
        if (res.data.status === 1){
          this.signList = res.data.data
        }else{
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    resetKey(key) {
      this.signListLoading = true
      request({
        url: "/controller/resetKey",
        method: "post",
        data: {
          "sign": key
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        this.signListLoading = false
        if (res.data.status === 1){
          ElNotification({
            title: '成功',
            message: "重置签名头成功",
            type: 'success',
          })
          this.getSignList()
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
    this.getSignList()
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sign-list {
  margin-top: 20px;
}
:deep(.el-card__body){
  padding: 0;
}
</style>