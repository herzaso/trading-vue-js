<template>
  <span>
    <trading-vue
      ref="tvjs"
      :data="chart"
      :width="width"
      :height="height"
      :timezone="parseInt(timezone)"
      :index-based="index_based"
      :overlays="overlays"
      :color-back="colors.colorBack"
      :color-grid="colors.colorGrid"
      :color-text="colors.colorText"
    />
    <span class="gc-mode">
      <input type="checkbox" v-model="index_based" />
      <label>Index Based</label>
    </span>
    <span class="timezone">
      <input type="number" min="-12" max="12" v-model="timezone" />
      <label>Timezone</label>
    </span>
  </span>
</template>

<script>
import TradingVue from "../../src/TradingVue.vue";
import Data from "../data/data_earn.json";
//import Data from '../data/data_aapl_1h.json'
//import Data from '../data/data_fresh.json'
//import Data from '../data/data_fresh_1D.json'
import DataCube from "../../src/helpers/datacube.js";
import Earnings from "./Stocks/Earnings.vue";
import Illuminati from "./shared/illuminati.js";
import Eye from "./shared/Eye.vue";

export default {
  name: "Stocks",
  description: "Should display marker hints (click earnings icon)",
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
      overlays: [Earnings, Eye],
      index_based: true,
      timezone: 0,
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
    window.tv = this.$refs.tvjs;
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

<style>
.timezone {
  position: absolute;
  top: 35px;
  right: 70px;
  color: #888;
  background: inherit;
  font: 11px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
.timezone input {
  color: #4285f4;
  background: inherit;
  border: 1px dotted #808080;
  border-radius: 3px;
  text-align: end;
}
</style>
