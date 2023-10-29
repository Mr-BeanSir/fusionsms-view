<template>
  <div style="margin-bottom: 20px">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>发信测试</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="sent">
    <el-card>
      <el-form ref="form" :model="data" label-width="80" label-position="left">
        <el-form-item prop="phone" label="手机号" :rules="{required: true,message: '手机号不可为空',trigger: 'blur',}">
          <el-input v-model="data.phone"/>
        </el-form-item>
        <el-form-item prop="sign_id" label="签名头" :rules="{required: true,message: '签名头不可为空',trigger: 'blur',}">
          <el-select @change="changeSelect" style="width: 100%" v-model="data.sign_id" placeholder="请选择签名头">
            <el-option v-for="(item,k) in signList"  :label="item.sign" :value="k" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="template.show" prop="template_id" label="发信模板" :rules="{required: true,message: '发信模板不可为空',trigger: 'blur',}">
          <el-select @change="changeTemplateSelect" style="width: 100%" v-model="data.template_id" placeholder="请选择签名头">
            <el-option v-for="(item,k) in template.templates"  :label="item.content" :value="k" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(v,k) in data.el" :label="'变量' + (k + 1)"
                      :rules="{
                        required: true,
                        message: '变量值不可为空',
                        trigger: 'blur',
                      }" :key="k" :prop="'el.'+k+'.value'">
          <el-input v-model="v.value" />
        </el-form-item>
      </el-form>
      <div style="display: flex;justify-content: end">
        <el-button @click="sent" type="primary">发送</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";
import 'element-plus/es/components/notification/style/css'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Sent",
  data() {
    let phone
    return {
      data: {
        phone,
        sign_id: '',
        template_id: '',
        tid: '',
        el: [],
      },
      signList: [],
      template: {
        show: false,
        templates: [],
      },
      valueInput: {
        show: false,
      },
    }
  },
  methods: {
    init() {
      request({
        url: "/controller/getSignList",
        method: "get",
      }).then(res => {
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
    changeSelect(val) {
      this.template.templates = []
      this.data.el = []
      if (this.signList[val].status !== 1){
        ElNotification({
          title: '错误',
          message: '此签名未通过审核',
          type: 'error',
        })
        this.data.sign_id = ''
        this.data.template_id = ''
        this.template.show = false
        return
      }
      request({
        url: "/controller/getSign/" + this.signList[val].id,
        method: "get",
      }).then(res => {
        if (res.data.status === 1){
          this.template.show = true
          this.template.templates = res.data.data
        }else{
          ElNotification({
            title: '错误',
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    changeTemplateSelect(val) {
      this.data.el = []
      if (this.template.templates[val].status !== 1){
        ElNotification({
          title: '错误',
          message: '此模板未通过审核',
          type: 'error',
        })
        this.data.template_id = ''
        return
      }
      let str = this.template.templates[val].content
      let arr = str.match(/@/g)
      for (let i = 0; i < arr.length; i++) {
        this.data.el.push({
          value: '',
        })
      }
    },
    sent() {
      let el = this.$refs['form']
      el.validate((valid) => {
        if (valid) {
          let content = this.template.templates[this.data.template_id].content
          for (let i = 0; i < this.data.el.length; i++) {
            content = content.replace("@",this.data.el[i].value)
          }
          console.log(this.signList)
          request({
            url: "/local",
            method: "post",
            data: {
              "to": this.data.phone,
              "content": content,
              "sid": this.signList[this.data.sign_id].id,
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
      })
    },
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>

</style>