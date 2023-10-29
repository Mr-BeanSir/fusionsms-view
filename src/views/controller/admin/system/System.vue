<template>
  <div style="margin-bottom: 20px">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <el-card>
    <el-tabs v-model="tabs_name">
      <el-tab-pane label="常规" name="normal"></el-tab-pane>
      <el-tab-pane label="发信设置" name="sent"><admin-sent-setting/></el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import AdminSentSetting from "@/components/system/Sent.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "System",
  components: {AdminSentSetting},
  data() {
    return {
      tabs_name: 'normal',

    }
  },
  methods: {

  },
  mounted() {

  }
}
</script>

<style scoped>

</style>