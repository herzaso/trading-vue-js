<template>
  <trading-vue
    ref="tv"
    :data="chart"
    :width="width"
    :height="height"
    :toolbar="true"
    :index-based="false"
    :extensions="extensions"
    :skin="skin"
    :color-back="colors.colorBack"
    :color-grid="colors.colorGrid"
    :color-text="colors.colorText"
  />
</template>

<script>
import TradingVue from "../../src/TradingVue.vue";
import Data from "../data/data_ext.json";
import DataCube from "../../src/helpers/datacube.js";
import GotoPresent from "./Extensions/GotoPresent/index.js";
import SkinPack from "./Extensions/SkinPack/index.js";

export default {
  name: "Extensions",
  description: "Widgets, Standalone Comps & Skins",
  components: {
    TradingVue,
  },
  props: ["night"],
  data() {
    return {
      chart: new DataCube(Data),
      width: window.innerWidth,
      height: window.innerHeight,
      extensions: [GotoPresent, SkinPack],
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
    skin() {
      return this.$props.night ? "NightSkin" : "DaySkin";
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
    window.dc = this.chart;
    window.tv = this.$refs.tv;
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
