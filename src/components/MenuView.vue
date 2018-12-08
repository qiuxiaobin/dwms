<template>
  <a-layout>
    <a-layout-sider>
      <div :class="$style.title">
        <img :class="$style.logo" src="@/assets/logo.png">
        <span>信托数据仓库管理系统</span>
      </div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']" :default-open-keys="['sub1', 'sub2', 'sub3']">
        <a-menu-item key="1">系统首页</a-menu-item>
        <a-sub-menu key="sub1" title="信托公司管理">
          <a-menu-item>公司列表</a-menu-item>
          <a-menu-item>新建公司</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2" title="人员管理">
          <a-menu-item>人员列表</a-menu-item>
          <a-menu-item>结构权限</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3" title="数据中心">
          <a-menu-item>公司规模</a-menu-item>
          <a-menu-item>经营状况</a-menu-item>
          <a-menu-item>资产运用分布</a-menu-item>
          <a-menu-item>新增信托产品分布</a-menu-item>
          <a-menu-item>已清算信托项目</a-menu-item>
          <a-menu-item>存续信托产品分类</a-menu-item>
          <a-menu-item>收入结构</a-menu-item>
          <a-menu-item>信托资产分类</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout-content>
      Hello World!
    </a-layout-content>
  </a-layout>
</template>

<script>
export default {};
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
</style>
