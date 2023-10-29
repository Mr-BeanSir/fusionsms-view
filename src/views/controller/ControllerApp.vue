<template>
  <div class="controller-app">
    <el-container>
      <el-header>
        <AppHeader/>
      </el-header>
      <div class="center">
        <el-main>
          <router-view/>
        </el-main>
        <el-footer>
          <AppFooter/>
        </el-footer>
      </div>
    </el-container>
  </div>
</template>

<script>
import AppFooter from "@/components/controller/AppFooter.vue";
import AppHeader from "@/components/controller/AppHeader.vue";
import "element-plus/es/components/notification/style/css"
export default {
  name: "ControllerApp",
  components: [
      AppHeader,AppFooter
  ],

}
</script>

<style lang="less" scoped>
.controller-app {
  background-color: rgb(249,249,249);
  height: 100vh;
}

:deep(.el-header) {
  border-bottom: rgb(235,235,235) 1px solid;
  --el-header-padding: 0;
  background-color: white;
}
:deep(.center) {
  width: 1028px;
  margin: 0 auto;
}
</style>