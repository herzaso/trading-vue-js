<template>
  <div class="chart-box">
    <trading-vue
      :id="id"
      :data="chart"
      :title-txt="title"
      :width="width"
      :height="height"
      :color-title="colors.colorTitle"
      :color-back="colors.colorBack"
      :color-grid="colors.colorGrid"
      :color-text="colors.colorText"
    />
  </div>
</template>

<script>
import TradingVue from "../../../src/TradingVue.vue";

export default {
  name: "Chartbox",
  components: {
    TradingVue,
  },
  props: ["id", "tf", "data", "width", "height", "night"],
  computed: {
    chart() {
      return { ohlcv: this.$props.data };
    },
    title() {
      return "Bitcoin " + this.$props.tf;
    },
    colors() {
      return this.$props.night
        ? {}
        : {
            colorBack: "#fff",
            colorGrid: "#eee",
            colorText: "#333",
            colorTitle: "#333",
          };
    },
  },
};
</script>

<style>
.chart-box {
  border: 0.5px solid transparent;
}
</style>
