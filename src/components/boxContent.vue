<template>
  <div>
    <a-tooltip placement="right">
      <div
        @click="onClick"
        :class="data.isWarning ? $style.boxContentWarning : $style.boxContent"
      >{{data.name=='资产负债率'?'1÷(1-资产负债率)':data.name}}</div>
      <div slot="title">
        <div>{{data.name}}</div>
        <div>您的{{data.name}}为{{data.your}}，平</div>
        <div>均为{{data.avg}}，高于{{data.over}}的公司</div>
      </div>
    </a-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onClick() {
      this.$emit("click", this.data.code);
    }
  }
};
</script>

<style module>
.boxContent {
  min-width: 40px;
  height: 28px;
  line-height: 28px;
  padding: 0 16px;
}
.boxContentWarning {
  composes: boxContent;
  color: #e60012;
}
</style>
