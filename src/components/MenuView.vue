<template>
  <a-layout>
    <a-layout-sider>
      <div :class="$style.title">
        <img :class="$style.logo" src="@/assets/logo.png">
        <span>信托数据仓库管理系统</span>
      </div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']" :default-open-keys="['sub1', 'sub2']">
        <a-menu-item key="1">系统首页</a-menu-item>
        <a-sub-menu key="sub1" title="报表信息">
          <a-menu-item>信托总资产</a-menu-item>
          <a-menu-item>总资产</a-menu-item>
          <a-menu-item>静资产</a-menu-item>
          <a-menu-item>新增集合信托</a-menu-item>
          <a-menu-item>新增财产信托</a-menu-item>
          <a-menu-item>新增单一信托</a-menu-item>
          <a-menu-item>信托报酬</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2" title="指标分析">
          <a-menu-item>杜邦分析</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :class="$style.header">
        <div :class="$style.user">你好，管理员！</div>
        <a-icon :class="$style.poweroff" type="poweroff"></a-icon>
        <a-icon :class="$style.profile" type="profile"></a-icon>
      </a-layout-header>
      <a-layout-content :class="$style.content">
        Content
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  beforeCreate() {
    this.$axios.get('/DW/anuRustCompanyScale/selectByCondition?limit=10000').then(res => {
      console.log(res);
    });
  }
};
</script>

<style module>
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  color: #fff;
  background-color: #0f58e0;
}
.logo {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
}
.content {
  margin: 16px 24px;
}
.poweroff, .profile, .user {
  margin-right: 15px;
}
</style>
