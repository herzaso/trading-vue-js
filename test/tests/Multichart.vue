<template>
  <div class="multi-chart">
    <chartbox
      v-for="(timeframe, id) in charts"
      :id="id"
      :key="id"
      :tf="id"
      :data="timeframe"
      :width="cbox_width"
      :height="cbox_height"
      :night="night"
    />
  </div>
</template>

<script>
import Chartbox from "./Multichart/Chartbox.vue";
import Data from "../data/data_tf.json";

// TODO: investigate chart-disappearing problem

export default {
  name: "Multichart",
  description: "All charts must work correctly and independently",
  components: {
    Chartbox,
  },
  props: ["night"],
  data() {
    return {
      charts: Data,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  computed: {
    cbox_width() {
      return Math.floor(this.width / 2 - 1);
    },
    cbox_height() {
      return Math.floor(this.height / 2 - 1);
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

<style>
.multi-chart {
  display: grid;
  grid-template-columns: 50% 50%;
  height: 100%;
}
</style>
