<template>
  <a-layout :class="$style.container">
    <a-layout-sider>
      <div :class="$style.title">
        <img
          :class="$style.logo"
          src="@assets/logo.png"
        >
        <span>信托数据仓库管理系统</span>
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        :selected-keys="[field]"
        :open-keys="openKeys"
      >
        <template v-for="menuItem in menuList">
          <a-sub-menu
            :key="menuItem.field"
            v-if="menuItem.children"
            :title="menuItem.title"
            @title-click="onTitleClick(menuItem.field)"
          >
            <a-menu-item
              v-for="subMenuItem in menuItem.children"
              :key="subMenuItem.field"
              @click="onMenuItemClick(menuItem.field, subMenuItem.field)"
            >
              <span>{{subMenuItem.title}}</span>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item
            :key="menuItem.field"
            v-else
            @click="onMenuItemClick(menuItem.field)"
          >
            <span>{{menuItem.title}}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :class="$style.header">
        <span :class="$style.user">{{userName}}</span>
        <a-icon
          :class="$style.logout"
          type="logout"
          @click="onLogoutClick"
        ></a-icon>
      </a-layout-header>
      <a-layout-content :class="$style.content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  props: {
    field: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      userName: "",
      menuList: [
        {
          field: "workspace",
          title: "系统首页"
        },
        {
          field: "report",
          title: "报表信息",
          children: [
            {
              field: "paidTrust",
              title: "实收信托"
            },
            {
              field: "trustEstate",
              title: "总资产"
            },
            {
              field: "totalAssetsRate",
              title: "净资产"
            },
            {
              field: "aggreateScale",
              title: "新增集合信托"
            },
            {
              field: "propertyScale",
              title: "新增财产信托"
            },
            {
              field: "singleScale",
              title: "新增单一信托"
            }
          ]
        },
        {
          field: "analysis",
          title: "指标分析",
          children: [
            {
              field: "dupont",
              title: "杜邦分析"
            }
          ]
        }
      ],
      openKeys: ["report", "analysis"]
    };
  },
  created() {
    this.$axios.get("/user").then(({ data }) => {
      if (data.code > -1) {
        this.userName = data.data.name;
      }
    });
  },
  methods: {
    onMenuItemClick(name, field) {
      this.$router.push({ path: `/${name}/${field}` });
    },
    onTitleClick({ key }) {
      this.openKeys = this.openKeys.reduce(
        (prev, openKey) => (openKey == key && prev) || [...prev, key],
        []
      );
    },
    onLogoutClick() {
      this.$axios.get("/DW/loginOrExit/checklogout").then(({ data }) => {
        if (data.flag > 0) {
          this.$router.push({ path: "/login" });
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  }
};
</script>

<style module>
.container {
  min-height: 100vh;
  background-color: #e5e5e5;
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  color: #fff;
  background-color: #002140;
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
  padding: 0;
  background-color: #fff;
}
.content {
  margin: 28px 23px 28px 25px;
  padding: 23px 24px 27px 24px;
  background-color: #fff;
}
.user {
  font-size: 16px;
  color: #3664ff;
  margin-right: 24px;
}
.logout {
  margin-right: 41px;
  cursor: pointer;
}
</style>
