<template>
  <div style="margin-bottom: 20px">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>发信日志</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="header">
    <div style="display: flex">
      <div class="status filter">
        <span class="title">状态:</span>
        <el-select v-model="filter.status">
          <el-option label="全部" value="all"/>
          <el-option label="成功" value="1"/>
          <el-option label="失败" value="2"/>
          <el-option label="待回执" value="3"/>
          <el-option label="正在发送" value="0"/>
        </el-select>
      </div>
      <div class="task-id filter">
        <span class="title">任务ID:</span>
        <el-input v-model="filter.task_id"/>
      </div>
      <div class="send-content">
        <span class="title">发信内容:</span>
        <el-input v-model="filter.content"/>
      </div>
    </div>
    <div style="display: flex">
      <div style="margin-top: 10px;flex-grow: 1;align-items: center" class="end-time filter">
        <span class="title">过滤时间:</span>
        <el-date-picker
            v-model="filter.time"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="filter.default_time"
            style="width: 90%"
        />
      </div>
      <el-button @click="filt" style="margin-top: 10px" type="primary">查询</el-button>
    </div>
  </div>

  <div class="log-table" style="margin-top: 20px;">
    <el-card style="--el-card-padding: 0">
      <el-table :data="table_list" stripe style="width: 100%">
        <el-table-column align="center" prop="id" label="任务ID" width="80"/>
        <el-table-column align="center" prop="uid" label="UID" width="50"/>
        <el-table-column align="center" prop="phone" label="手机号" width="115"/>
        <el-table-column align="center" label="发信内容">
          <template #default="scope">
            <el-tooltip
                effect="dark"
                placement="top-end"
            >
              <template v-slot:content>
                <p style="max-width: 120px;word-break: break-all">
                  {{ scope.row.content }}
                </p>
              </template>
              <p style="display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical">
                {{ scope.row.content }}
              </p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="time" label="发送时间"/>
        <el-table-column prop="receive" label="回执内容" width="120" align="center"/>
        <el-table-column align="center" prop="receive_time" label="回执时间"/>
        <el-table-column prop="decrease_num" label="计费" width="70" align="center"/>
        <el-table-column label="发信状态" width="100" align="center">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === 1">成功</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 2">失败</el-tag>
            <el-tag type="warning" v-if="scope.row.status === 0">正在发送</el-tag>
            <el-tag type="info" v-if="scope.row.status === 3">等待回执</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination @current-change="init" :current-page="current_page" :page-size="50" style="margin-top: 10px;display: flex;justify-content: center"
                   background layout="prev, pager, next" :total="num"/>
  </div>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";
import moment from 'moment';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Log",
  data() {
    return {
      filter: {
        status: 'all',
        task_id: '',
        content: '',
        time: [
          new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
          new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59),
        ],
        sub_status: 'all',
        sub_task_id: '',
        sub_content: '',
        sub_time: [
          new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
          new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59),
        ],
        default_time: [
          new Date(2023, 2, 18, 0, 0, 0),
          new Date(2023, 2, 18, 23, 59, 59),
        ],
      },
      table_list: [],
      num: 0,
      current_page: 1,
    }
  },
  methods: {
    init(pages) {
      request({
        url: "/admin/log/get",
        method: "post",
        data: {
          "start": moment(this.filter.sub_time[0]).format(),
          "end": moment(this.filter.sub_time[1]).format(),
          "type": this.filter.sub_status,
          "task_id": this.filter.sub_task_id,
          "content": this.filter.sub_content,
          "pages": pages,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.status === 1) {
          this.current_page = pages
          for (let i in res.data.data) {
            if (res.data.data[i].receive_time !== null){
              let t = new Date(res.data.data[i].receive_time)
              res.data.data[i].receive_time = (t.getFullYear() + "-" + t.getMonth() + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds())
            }else{
              res.data.data[i].receive_time = ''
            }

            let t1 = new Date(res.data.data[i].time)
            res.data.data[i].time = t1.getFullYear() + "-" + t1.getMonth() + "-" + t1.getDate() + " " + t1.getHours() + ":" + t1.getMinutes() + ":" + t1.getSeconds()
          }
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
        url: "/admin/log/get",
        method: "post",
        data: {
          "start": moment(this.filter.time[0]).format(),
          "end": moment(this.filter.time[1]).format(),
          "type": this.filter.status,
          "task_id": this.filter.task_id,
          "content": this.filter.content,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.status === 1) {
          this.current_page=1
          this.filter.sub_time = this.filter.time
          this.filter.sub_status = this.filter.status
          this.filter.sub_content = this.filter.content
          this.filter.sub_task_id = this.filter.task_id
          for (let i in res.data.data) {
            if (res.data.data[i].receive_time !== null){
              let t = new Date(res.data.data[i].receive_time)
              res.data.data[i].receive_time = (t.getFullYear() + "-" + t.getMonth() + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds())
            }else{
              res.data.data[i].receive_time = ''
            }
            let t1 = new Date(res.data.data[i].time)
            res.data.data[i].time = t1.getFullYear() + "-" + t1.getMonth() + "-" + t1.getDate() + " " + t1.getHours() + ":" + t1.getMinutes() + ":" + t1.getSeconds()
          }
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
    }
  },
  mounted() {
    this.init()
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