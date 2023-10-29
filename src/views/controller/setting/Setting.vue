<template class="setting">
  <div style="margin-bottom: 20px">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>发信设置</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <RemainingLimitPrompt/>
  <WhiteList class="lgw"/>
  <BlackPhone class="lgw"/>
  <LimitSetting class="lgw"/>
</template>

<script>
import WhiteList from "@/components/setting/WhiteList.vue";
import BlackPhone from "@/components/setting/BlackPhone.vue";
import RemainingLimitPrompt from "@/components/setting/RemaningLimitPropt.vue";
import LimitSetting from "@/components/setting/LimitSetting.vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "setting",
  components: {LimitSetting, RemainingLimitPrompt, BlackPhone, WhiteList}
}
</script>

<style lang="less" scoped>
.lgw {
  margin-top: 20px;
}
</style>