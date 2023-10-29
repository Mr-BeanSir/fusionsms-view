<template>
  <div style="margin-bottom: 20px">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="header">
    <div style="display: flex">
      <div class="uid filter">
        <span class="title">UID:</span>
        <el-input v-model="filter.uid"/>
      </div>
      <div class="username filter">
        <span class="title">用户名:</span>
        <el-input v-model="filter.username"/>
      </div>
      <div class="status filter">
        <span class="title">状态:</span>
        <el-select v-model="filter.status">
          <el-option label="全部" value="all"/>
          <el-option label="正常" value="0"/>
          <el-option label="封禁" value="1"/>
          <el-option label="禁止发信" value="2"/>
        </el-select>
      </div>
      <el-button @click="filt" style="margin-top: 2px" type="primary">查询</el-button>
    </div>
  </div>

  <div class="log-table" style="margin-top: 20px;">
    <el-card style="--el-card-padding: 0">
      <el-table :data="table_list" stripe style="width: 100%">
        <el-table-column align="center" prop="uid" label="UID" width="80"/>
        <el-table-column align="center" prop="username" label="用户名" width="115"/>
        <el-table-column align="center" prop="quota" label="短信额度"/>
        <el-table-column align="center" prop="status" label="状态"/>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button type="primary" @click="$router.push({name: 'userDetail',params: {uid: scope.row.uid}})">管理</el-button>
            <el-button type="warning" @click="balance.show = true;balance.uid = scope.row.uid;balance.username=scope.row.username">余额</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination @current-change="init" :page-size="30" style="margin-top: 10px;display: flex;justify-content: center"
                   background layout="prev, pager, next" :total="num"/>
  </div>
  <el-dialog v-model="balance.show" title="修改余额">
    <el-form v-model="balance" label-width="60" label-position="left">
      <el-form-item label="UID">
        <el-input disabled v-model="balance.uid"/>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input disabled v-model="balance.username"/>
      </el-form-item>
      <el-form-item label="余额">
        <el-input v-model="balance.num" placeholder="直接填写要加的余额，减少在前面加上 -"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeBalance">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";

export default {
  name: "adminUser",
  data() {
    return {
      filter: {
        status: 'all',
        uid: '',
        username: '',
        sub_status: 'all',
        sub_uid: '',
        sub_username: '',
      },
      table_list: [],
      num: 0,
      balance: {
        num: '',
        uid: '',
        username: '',
        show: false,
      }
    }
  },
  methods: {
    init(pages) {
      request({
        url: "/admin/user/list",
        method: "post",
        data: {
          "status": this.filter.sub_status,
          "uid": this.filter.sub_uid,
          "username": this.filter.sub_username,
          "pages": pages,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.status === 1) {
          this.table_list = res.data.data
          this.num = res.data.num
        } else {
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    filt() {
      request({
        url: "/admin/user/list",
        method: "post",
        data: {
          "status": this.filter.status,
          "uid": this.filter.uid,
          "username": this.filter.username,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.status === 1) {
          this.filter.sub_status = this.filter.status
          this.filter.sub_username = this.filter.username
          this.filter.sub_uid = this.filter.uid
          this.table_list = res.data.data
          this.num = res.data.num
        } else {
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    changeBalance(){
      request({
        url: "/admin/user/changeBalance",
        method: "post",
        data: {
          "num": this.balance.num,
          "uid": this.balance.uid,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.status === 1) {
          this.init()
          this.balance.show=false
          this.balance.num=''
          this.balance.uid=''
          this.balance.username=''
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
    }
  },
  mounted() {
    this.init(1)
  }
}
</script>

<style lang="less" scoped>
:deep(.box-item) {
  width: 150px;
}

.header {
  .send-content {
    :deep(.el-input) {
      display: inline;
    }

    .title {
      padding-right: 5px;
      color: rgb(96, 98, 102);
    }

    :deep(.el-input__wrapper) {
      width: 390px;
    }
  }

  .filter {
    margin-right: 10px;

    :deep(.el-input) {
      display: inline;
    }

    .title {
      padding-right: 5px;
      color: rgb(96, 98, 102);
    }
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}
</style>