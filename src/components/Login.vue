<template>
  <div :class="$style.container">
    <div :class="$style.banner">
      <img :class="$style.logo" src="@assets/logo.png">
      <div :class="$style.text">
        <div :class="$style.title">用户登录</div>
        <div :class="$style.description">信托数据仓库管理系统</div>
      </div>
    </div>
    <div :class="$style.content">
      <a-form @submit="onSubmit" :autoFormCreate="(form) => this.form = form">
        <a-alert type="error" closable v-show="error" :message="error" showIcon/>
        <a-form-item 
          fieldDecoratorId="name" 
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入账户名', whitespace: true}]}"
        >
          <a-input placeholder="admin">
            <a-icon slot="suffix" type="user"></a-icon>
          </a-input>
        </a-form-item>
        <a-form-item
          fieldDecoratorId="password" 
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码', whitespace: true}]}"
        >
          <a-input placeholder="123456" type="password">
            <a-icon slot="suffix" type="lock"></a-icon>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button :loading="logging" size="large" htmlType="submit" type="primary" block>登录</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div :class="$style.footer">Copyright@2018 tn</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logging: false,
      error: ""
    };
  },
  methods: {
    onSubmit() {
      this.form.validateFields(err => {
        if (err) return;
        this.logging = true;
        this.$axios
          .post("/login", {
            name: this.form.getFieldValue("name"),
            password: this.form.getFieldValue("password")
          })
          .then(({ data }) => {
            this.logging = false;
            if (data.code > -1) {
              this.$router.push({ name: "index" });
              this.$message.success(data.message, 3);
            } else {
              this.error = data.message;
            }
          });
      });
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
  background: url(@assets/banner.jpg) no-repeat center;
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
