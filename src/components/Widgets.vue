<template>
  <!-- WidgetS Layer -->
  <div
    class="tvjs-widgets"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <component
      :is="initw(id)"
      v-for="id in Object.keys(map)"
      :id="id"
      :key="id"
      :main="map[id].ctrl"
      :data="map[id].data"
      :tv="tv"
      :dc="dc"
    />
  </div>
</template>

<script>
export default {
  name: "Widgets",
  props: ["width", "height", "map", "tv", "dc"],
  methods: {
    initw(id) {
      console.log('>>>>>>>>>>> I added name here', this.$props.map[id].cls);
      return this.$props.map[id].cls.name;
    },
  },
};
</script>

<style>
.tvjs-widgets {
  position: absolute;
  z-index: 1000;
  pointer-events: none;
}
</style>
