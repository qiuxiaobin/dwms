<template>
  <div :class="$style.container">
    <div :class="$style.banner">
      <img
        :class="$style.logo"
        src="@assets/logo.png"
      >
      <a :class="$style.help">寻求帮助</a>
      <div :class="$style.text">
        <div :class="$style.title">用户登录</div>
        <div :class="$style.description">信托数据仓库管理系统</div>
      </div>
    </div>
    <div :class="$style.content">
      <a-form
        @submit="onSubmit"
        :autoFormCreate="(form) => this.form = form"
      >
        <a-alert
          type="error"
          closable
          v-show="error"
          :message="error"
          showIcon
        />
        <a-form-item
          fieldDecoratorId="name"
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入账户名', whitespace: true}]}"
        >
          <a-input
            placeholder="同牛账号"
            :class="$style.loginInput"
          >
            <a-icon
              slot="suffix"
              type="user"
            ></a-icon>
          </a-input>
        </a-form-item>
        <a-form-item
          fieldDecoratorId="password"
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码', whitespace: true}]}"
        >
          <a-input
            placeholder="请输入密码"
            type="password"
            :class="$style.loginInput"
          >
            <a-icon
              slot="suffix"
              type="lock"
            ></a-icon>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :loading="logging"
            :class="$style.loginBtn"
            size="large"
            htmlType="submit"
            type="primary"
            block
          >登录</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div :class="$style.footer">同牛科技 TN-TECH</div>
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

        const username = this.form.getFieldValue("name");
        const password = this.form.getFieldValue("password");
        this.$axios
          .get(
            `/DW/loginOrExit/checkLogin?username=${username}&password=${password}`,
            {
              username,
              password
            }
          )
          .then(({ data }) => {
            this.logging = false;
            if (data.flag > -1) {
              this.$message.success(data.msg);
              this.$router.push({ name: "workspace" });
            } else {
              this.error = data.msg;
            }
          })
          .catch(data => {
            this.logging = false;
            this.$message.error(data.message || "系统错误");
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
  height: 372px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: url(@assets/banner.png) no-repeat top;
}
.content {
  flex: 1;
  width: 400px;
  margin: 50px auto 0;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  color: #9d9fa0;
}
.text {
  padding: 50px 0;
  text-align: center;
}
.title {
  color: #fff;
  font-size: 30px;
}
.description {
  color: #e1e1e2;
  font-size: 20px;
}
.logo {
  position: absolute;
  left: 60px;
  top: 60px;
  width: 149px;
  height: 40px;
}
.help {
  position: absolute;
  top: 71px;
  right: 64px;
  color: #d0d1d2;
  font-size: 14px;
}
.loginInput {
  height: 54px;
  font-size: 14px !important;
  padding-left: 16px;
  color: #c5c5c5;
}
.loginBtn {
  width: 400px;
  height: 54px;
  background: linear-gradient(89deg, rgba(0, 158, 250, 1), rgba(0, 97, 237, 1));
  border-radius: 6px;
}
.loginBtn:hover {
  background: linear-gradient(89deg, rgba(0, 158, 250, 1), rgba(0, 97, 237, 1));
}
</style>
