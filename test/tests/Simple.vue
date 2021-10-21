<template>
  <trading-vue
    :data="chart"
    :width="width"
    :height="height"
    :toolbar="true"
    :color-back="colors.colorBack"
    :color-grid="colors.colorGrid"
    :color-text="colors.colorText"
  />
</template>

<script>
import TradingVue from "../../src/TradingVue.vue";
import Data from "../data/data_btc.json";
import DataCube from "../../src/helpers/datacube.js";

export default {
  name: "Simple",
  description: "Should display everything okay",
  components: {
    TradingVue,
  },
  props: {
    night: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chart: new DataCube(Data),
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
    window.dc = this.chart;
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
