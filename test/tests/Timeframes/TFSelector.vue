<template>
  <!-- Timeframe Selector -->
  <div class="tf-selector">
    <span
      v-for="(tf, i) in timeframes"
      :key="i"
      class="timeframe"
      :style="selected === i ? { color: '#44c767' } : {}"
      @click="on_click(tf, i)"
    >
      {{ tf }}
    </span>
  </div>
</template>

<script>
export default {
  name: "TfSelector",
  props: ["charts"],
  emits: ["selected"],
  data() {
    return {
      selected: 0,
    };
  },
  computed: {
    timeframes() {
      return Object.keys(this.$props.charts);
    },
  },
  mounted() {
    this.$emit("selected", {
      name: this.timeframes[this.selected],
      i: this.selected,
    });
  },
  methods: {
    on_click(tf, i) {
      this.selected = i;
      this.$emit("selected", {
        name: this.timeframes[this.selected],
        i: this.selected,
      });
    },
  },
};
</script>

<style>
.tf-selector {
  position: absolute;
  top: 15px;
  right: 80px;
  font: 16px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  background: #34363b;
  color: #ccc;
  padding: 8px;
  border-radius: 3px;
}
.timeframe {
  margin-right: 5px;
  user-select: none;
  cursor: pointer;
  font-weight: 200;
  max-width: 10px;
}
.timeframe:hover {
  color: #fff;
}
</style>
