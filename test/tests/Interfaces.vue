<template>
  <trading-vue
    ref="tv"
    :data="chart"
    :width="width"
    :height="height"
    :chart-config="{ DEFAULT_LEN: 120 }"
    :overlays="overlays"
    :toolbar="true"
    :color-back="colors.colorBack"
    :color-grid="colors.colorGrid"
    :color-text="colors.colorText"
  />
</template>

<script>
import TradingVue from "../../src/TradingVue.vue";
import DataCube from "../../src/helpers/datacube.js";
import Data from "../data/data_ux.json";
import SplineUx from "./Interfaces/SplineUx.vue";

export default {
  name: "Interfaces",
  description: "Html interfaces: static & interactive]",
  early: true,
  components: {
    TradingVue,
  },
  props: ["night"],
  data() {
    return {
      chart: new DataCube(Data), // Data will be here,
      width: window.innerWidth,
      height: window.innerHeight,
      overlays: [SplineUx],
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
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
    window.dc = this.chart;
    window.tv = this.$refs.tv;
  },
  methods: {
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight - 50;
    },
  },
};
</script>
