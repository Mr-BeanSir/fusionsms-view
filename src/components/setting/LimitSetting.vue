<template>
  <el-card>
    <div class="remaning-limit-propt">
      <div class="header">
        <span style="font-weight: bold">限流设置</span>
        <el-button @click="addOptions.show = true;addOptions.title = '添加规则'" type="primary" style="width: 10%">添加规则</el-button>
      </div>
      <div style="margin-top: 10px;">
        <div class="select">
          <el-table v-loading="tableLoading" :data="limitList" stripe style="width: 100%">
            <el-table-column fixed="left" align="center" prop="id" label="签名头ID" width="85" />
            <el-table-column align="center" prop="num" label="限发数" />
            <el-table-column align="center" label="限制时间">
              <template #default="scope">
                <span v-if="scope.row.time === 's'">秒</span>
                <span v-if="scope.row.time === 'm'">分</span>
                <span v-if="scope.row.time === 'h'">时</span>
                <span v-if="scope.row.time === 'd'">天</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="160" fixed="right">
              <template #default="scope">
                <el-button @click="addOptions.data.id = scope.row.id;addOptions.data.type = scope.row.time;this.addOptions.data.num = scope.row.num;
                this.addOptions.data.sid = scope.row.sid;addOptions.show = true;addOptions.title = '修改规则'" type="primary">修改</el-button>
                <el-popconfirm @confirm="deleteLimit(scope.row.id)" title="确定删除这条规则？">
                  <template #reference>
                    <el-button type="danger">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog :before-close="()=>{addOptions.data = {};addOptions.data.id = -1;addOptions.show = false}" :title="addOptions.title" v-model="addOptions.show" width="515">
      <el-form v-model="addOptions.data" label-width="90" label-position="left">
        <el-form-item label="SID">
          <el-input type="text" placeholder="签名头ID" v-model="addOptions.data.sid" />
        </el-form-item>
        <el-form-item label="限制发信数">
          <el-input type="number" placeholder="在指定时间之间限制发送的数量" v-model="addOptions.data.num" />
        </el-form-item>
        <el-form-item label="时间">
          <el-select v-model="addOptions.data.type" placeholder="请选择">
            <el-option label="秒" value="s" />
            <el-option label="分" value="m" />
            <el-option label="时" value="h" />
            <el-option label="天" value="d" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="addOptions.button_loading" @click="addLimit();addOptions.button_loading = true;tableLoading = true" type="primary">提交</el-button>
        <el-button @click="addOptions.show = false;addOptions.button_loading = false;tableLoading = false;addOptions.data = {};">取消</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import 'element-plus/es/components/notification/style/css'
import request from "@/common/request";
import {ElNotification} from "element-plus";

export default {
  name: "LimitSetting",
  data() {
    return {
      limitList: [],
      tableLoading: true,
      addOptions: {
        id: 0,
        title: '',
        show: false,
        data: {
          id: -1,
          type: 's'
        },
        button_loading: false,
      }
    }
  },
  methods: {
    init() {
      request({
        url: "/controller/setting/getLimit",
        method: "get",
      }).then(res => {
        this.tableLoading = false
        if (res.data.status === 1){
          this.limitList = res.data.data
        }else{
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    addLimit() {
      console.log(this.addOptions.data)
      if (this.addOptions.data.id !== -1){
        request({
          url: "/controller/setting/editLimit",
          method: "post",
          data: {
            id: this.addOptions.data.id,
            sid: this.addOptions.data.sid,
            num: this.addOptions.data.num,
            type: this.addOptions.data.type,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(res => {
          this.addOptions.show = false
          this.addOptions.button_loading = false
          this.tableLoading = false
          if (res.data.status === 1){
            this.init()
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
      }else{
        request({
          url: "/controller/setting/addLimit",
          method: "post",
          data: {
            sid: this.addOptions.data.sid,
            num: this.addOptions.data.num,
            type: this.addOptions.data.type,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(res => {
          this.addOptions.button_loading = false
          this.tableLoading = false
          this.addOptions.show = false
          if (res.data.status === 1){
            this.init()
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
    deleteLimit(id) {
      request({
        url: "/controller/setting/deleteLimit",
        method: "post",
        data: {
          id: id,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.status === 1){
          this.tableLoading = true
          this.init()
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
.header {
  display: flex;
  justify-content: space-between;
}
</style>