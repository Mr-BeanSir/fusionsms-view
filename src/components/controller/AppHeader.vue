<template>
  <header class="controller-app-header center">
    <div class="title">
      {{title}}
    </div>
    <el-menu
        :default-active="activeIndex"
        :ellipsis="false"
        @select="handleSelect"
        :default-openeds="select"
        mode="horizontal"
    >
      <template v-for="item in sideMenuData">
        <el-menu-item :key="item.name" :index="item.index" v-if="!item.child">
          <span class="select">{{ item.name }}</span>
        </el-menu-item>

        <el-sub-menu :key="item.name" :index="item.index" v-if="item.child">
          <template v-slot:title>
            <span class="select">{{ item.name }}</span>
          </template>
          <template :key="item2.index" v-for="item2 in item.child">
            <el-menu-item :index="item2.index">
              <span class="select">{{ item2.name }}</span>
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
      <el-menu-item @click="logout">退出登录</el-menu-item>
    </el-menu>
  </header>
</template>

<script>
import request from "@/common/request";
import {ElNotification} from "element-plus";

export default {
  name: "AppHeader",
  data() {
    return {
      title: import.meta.env.VITE_APP_TITLE,
      activeIndex: "index",
      select: [],
      sideMenuData: [
        {
          index: "index",
          name: "首页",
        },
        {
          index: "signList",
          name: "签名列表",
        },
        {
          index: "sent",
          name: "发信测试",
        },
        {
          index: "log",
          name: "发信日志",
        },
        {
          index: "setting",
          name: "发信设置",
        },
        {
          index: "exchange",
          name: "兑换",
        },
      ]
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      let url = '';
      // for (let keyPathKey in keyPath) {
      //   url += keyPath[keyPathKey];
      // }
      url = key
      this.$router.push({
        name: url
      })
    },
    logout() {
      request({
        url: "/user/logout",
        method: "get",
      }).then(res => {
        if (res.data.status === 1){
          ElNotification({
            title: '成功',
            message: "退出登录成功",
            type: 'success',
          })
          localStorage.removeItem("token")
          setTimeout(() => {
            this.$router.push({
              name: "login"
            })
          },500)
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
    this.activeIndex = /\/(.*)/.exec(this.$route.path)[1];
    for (let x of this.sideMenuData) {
      if (!Object.prototype.hasOwnProperty.call(x,'child')){
        continue
      }
      for (let y of x.child) {
        if (y.index === this.activeIndex){
          this.select.push(y)
        }
      }
    }
    if (JSON.parse(atob(window.localStorage.getItem("token").split('.')[1]))['group'] === 6){
      this.sideMenuData.push({
        index: "",
        name: "管理员设置",
        child: [
          {
            index: "adminUser",
            name: "用户管理"
          },
          {
            index: "SendLog",
            name: "发信日志"
          },
          {
            index: "AdminExchange",
            name: "兑换"
          },
          {
            index: "SystemSetting",
            name: "系统设置"
          },
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.controller-app-header {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-wrap: wrap;
  justify-content: space-between;
  .title {
    color: rgb(88,94,92);
    font-size: 28px;
    font-weight: bold;
  }
}
//@media (min-width: 1063px) {
//  .title {
//    transition: all 0.5s;
//    padding: 0 20px;
//  }
//}
@media (max-width: 1063px) {
  .title {
    transition: all 0.5s;
    padding: 0;
  }
}
</style>