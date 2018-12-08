<template>
  <div :class="$style.container">
    <div :class="$style.banner">
      <img :class="$style.logo" src="@/assets/logo.png">
      <div :class="$style.text">
        <div :class="$style.title">用户登录</div>
        <div :class="$style.description">信托数据仓库管理系统</div>
      </div>
    </div>
    <div :class="$style.content">
      <a-form @submit="onSubmit">
        <a-form-item>
          <a-input placeholder="同牛账户">
            <a-icon slot="suffix" type="user"></a-icon>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input placeholder="输入密码">
            <a-icon slot="suffix" type="lock"></a-icon>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button size="large" type="primary" block>登录</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div :class="$style.footer">Copyright@2018 tn</div>
  </div>
</template>

<script>
export default {
  methods: {
    onSubmit() {
      this.$router.push("/");
    }
  }
};
</script>

<style module>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.banner {
  position: relative;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: url(@/assets/banner.jpg) no-repeat center;
}
.content {
  flex: 1;
  width: 400px;
  margin: 70px auto 0;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
.text {
  padding: 50px 0;
  text-align: center;
}
.title {
  color: #fff;
  font-size: 34px;
}
.description {
  color: #ccc;
  font-size: 20px;
}
.logo {
  position: absolute;
  left: 25px;
  top: 25px;
  width: 60px;
  height: 60px;
}
</style>
