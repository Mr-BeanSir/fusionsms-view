<template>
  <div class="controller-index">
    <el-row style="margin-top: 0" :gutter="24" class="controller-index-card">
      <el-col :span="8">
        <el-card class="card">
          <span class="iconfont icon-duanxinqunfa_o"></span>
          <div class="content">
            {{ daySend }}
          </div>
          <div class="tips">
            今日发信数
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card">
          <span class="iconfont icon-chenggong"></span>
          <div class="content">
            {{ daySendSuccess }}
          </div>
          <div class="tips">
            今日发信成功
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card">
          <span class="iconfont icon-shibai2"></span>
          <div class="content">
            {{ daySendError }}
          </div>
          <div class="tips">
            今日发信失败
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="controller-index-card">
      <el-col :span="8">
        <el-card class="card">
          <span class="iconfont icon-check"></span>
          <div class="content">
            {{paddingSign}}
          </div>
          <div class="tips">
            待审核签名
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card">
          <span class="iconfont icon-mobankuangjia"></span>
          <div class="content">
            {{ paddingTemplate }}
          </div>
          <div class="tips">
            待审核报备模板
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card">
          <span class="iconfont icon-yue"></span>
          <div class="content">
            {{ surplusQuota }}
          </div>
          <div class="tips">
            剩余额度
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="controller-index-card">
      <el-col :span="12">
        <el-card class="card">
          <span class="iconfont icon-key" style="font-size: 45px"></span>
          <div class="content" style="font-size: 1em">
            {{accountKey}}
          </div>
          <div class="tips">
            账户Key
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card">
          <span class="iconfont icon-group" style="font-size: 45px"></span>
          <div class="content" style="font-size: 1em">
            Null
          </div>
          <div class="tips">
            Null
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="chart-card">
      <div style="width: 100%;height: 300px" class="chart" ref="chart"/>
    </el-card>
  </div>
</template>

<script>
import 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/echarts/5.3.0-rc.1/echarts.min.js'
import request from "@/common/request";
import {ElNotification} from "element-plus";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Index",
  data() {
    return {
      daySend: 0,
      daySendSuccess: 0,
      daySendError: 0,
      paddingSign: 0,
      paddingTemplate: 0,
      surplusQuota: 0,
      ajaxLoad: false,
      accountKey: '',
    }
  },
  methods: {
    init() {
      request({
        url: "/controller/Api/getControllerIndex",
        method: "get",
      }).then((res) => {
        if (res.data.status === 1) {
          let d = res.data
          this.daySend = d.daySendNum
          this.daySendSuccess = d.daySendSuccessNum
          this.daySendError = d.daySendErrorNum
          this.paddingSign = d.paddingSignNum
          this.paddingTemplate = d.paddingTemplateNum
          this.surplusQuota = d.surplusQuotaNum
          this.accountKey = d.accountKey
          this.ajaxLoad = true
        }else{
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    chart() {
      request({
        url: "/controller/Api/getChartData",
        method: "get",
      }).then((res) => {
        if (res.data.status === 1) {
          let v = res.data.data
          let x=[],all=[],success=[],error=[]

          for (let k in v) {
            x.push(k)
            success.push(v[k].success)
            error.push(v[k].error)
            all.push(v[k].all)
          }
          // eslint-disable-next-line no-undef
          let chart = echarts.init(this.$refs['chart'])
          chart.setOption({
            title: {
              text: '发信概览'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['发信数', '成功发信', '失败发信']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: x
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '发信数',
                type: 'line',
                data: all
              },
              {
                name: '成功发信',
                type: 'line',
                data: success
              },
              {
                name: '失败发信',
                type: 'line',
                data: error
              }
            ]
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
  mounted() {
    this.init()
    this.chart()
  },
}
</script>

<style lang="less" scoped>
.controller-index {

}
.controller-index-card {
  margin: 20px 0;
  .card {
    position: relative;
    .iconfont {
      font-size: 52px;
      position: absolute;
      right: 20px;
    }
    .content {
      font-size: 1.3em;
      margin-bottom: 5px;
    }
    .tips {
      color: #7a7a7a;
    }
  }
}
</style>