<template>
  <trading-vue
    :data="chart"
    :width="width"
    :height="height"
    :color-back="colors.colorBack"
    :color-grid="colors.colorGrid"
    :color-text="colors.colorText"
  />
</template>

<script>
import TradingVue from "../../src/TradingVue.vue";
import Data from "../data/data_v1_1.json";

export default {
  name: "ChartTypes",
  description: "Should allow you to switch between different chart types",
  components: {
    TradingVue,
  },
  props: ["night"],
  data() {
    return {
      chart: Data,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  computed: {
    colors() {
      return this.$props.night
        ? {}
        : {
            colorBack: "#fff",
            colorGrid: "#eee",
            colorText: "#333",
          };
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight - 50;
    },
  },
};
</script>
