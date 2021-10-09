<template>
  <trading-vue
    ref="tvjs"
    :data="chart"
    :width="width"
    :height="height"
    :chart-config="{ DEFAULT_LEN: 200 }"
    :toolbar="true"
    :color-back="colors.colorBack"
    :color-grid="colors.colorGrid"
    :color-text="colors.colorText"
    :overlays="overlays"
  />
</template>

<script>
import TradingVue from "../../src/TradingVue.vue";
import Data from "../data/data_renko.json";
import DataCube from "../../src/helpers/datacube.js";
import Illuminati from "./shared/illuminati.js";
import Eye from "./shared/Eye.vue";

export default {
  name: "Renko",
  description: "Just Renko, what did you expect?",
  components: {
    TradingVue,
  },
  mixins: [Illuminati],
  props: ["night"],
  data() {
    return {
      chart: new DataCube(Data),
      width: window.innerWidth,
      height: window.innerHeight,
      overlays: [Eye],
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
    window.tv = this.$refs.tvjs;
  },
  methods: {
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight - 50;
    },
  },
};
</script>
