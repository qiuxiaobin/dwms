<template>
  <div :class="$style.welcome">
    <span :class="$style.welcomeEN">WELCOME</span>
    <P>欢迎进入信托数据管理系统</P>
  </div>
</template>
<style module>
.welcome {
  color: #3664ff;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  width: 100%;
  text-align: center;
  font-size: 28px;
}
.welcomeEN {
  font-size: 56px;
}
:global(.ant-layout-content) {
  position: relative;
}
</style>

