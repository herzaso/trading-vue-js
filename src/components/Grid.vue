<script>
// Sets up all layers/overlays for the grid with 'grid_id'
import { h } from "vue";

import Grid from "./js/grid.js";
import Canvas from "../mixins/canvas.js";
import UxList from "../mixins/uxlist.js";
import Crosshair from "./Crosshair.vue";
import KeyboardListener from "./KeyboardListener.vue";
import UxLayer from "./UxLayer.vue";

import Spline from "./overlays/Spline.vue";
import Splines from "./overlays/Splines.vue";
import Range from "./overlays/Range.vue";
import Trades from "./overlays/Trades.vue";
import Channel from "./overlays/Channel.vue";
import Segment from "./overlays/Segment.vue";
import Candles from "./overlays/Candles.vue";
import Volume from "./overlays/Volume.vue";
import Splitters from "./overlays/Splitters.vue";
import LineTool from "./overlays/LineTool.vue";
import RangeTool from "./overlays/RangeTool.vue";

export default {
  name: "Grid",
  components: { Crosshair, KeyboardListener },
  mixins: [Canvas, UxList],
  props: [
    "sub",
    "layout",
    "range",
    "interval",
    "cursor",
    "colors",
    "overlays",
    "width",
    "height",
    "data",
    "grid_id",
    "y_transform",
    "font",
    "tv_id",
    "config",
    "meta",
    "shaders",
  ],
  emits: [
    "cursor-changed",
    "cursor-locked",
    "layer-meta-props",
    "custom-event",
    "register-kb-listener",
    "remove-kb-listener",
    "rezoom-range",
    "sidebar-transform",
    "range-changed",
  ],
  data() {
    return {
      layer_events: {
        onNewGridLayer: this.new_layer,
        onDeleteGridLayer: this.del_layer,
        onShowGridLayer: (d) => {
          this.renderer.show_hide_layer(d);
          this.redraw();
        },
        onRedrawGrid: this.redraw,
        onLayerMetaProps: (d) => this.$emit("layer-meta-props", d),
        onCustomEvent: (d) => this.emit_custom_event(d),
      },
      keyboard_events: {
        onRegisterKbListener: (event) => {
          this.$emit("register-kb-listener", event);
        },
        onRemoveKbListener: (event) => {
          this.$emit("remove-kb-listener", event);
        },
        onKeyup: (event) => {
          if (!this.is_active) return;
          this.renderer.propagate("keyup", event);
        },
        onKeydown: (event) => {
          if (!this.is_active) return; // TODO: is this neeeded?
          this.renderer.propagate("keydown", event);
        },
        onKeypress: (event) => {
          if (!this.is_active) return;
          this.renderer.propagate("keypress", event);
        },
      },
    };
  },
  computed: {
    is_active() {
      return (
        this.$props.cursor.t !== undefined &&
        this.$props.cursor.grid_id === this.$props.grid_id
      );
    },
  },
  watch: {
    range: {
      handler: function () {
        // TODO: Left-side render lag fix:
        // Overlay data is updated one tick later than
        // the main sub. Fast fix is to delay redraw()
        // call. It will be a solution until a better
        // one comes by.
        this.$nextTick(() => this.redraw());
      },
      deep: true,
    },
    cursor: {
      handler: function () {
        if (!this.$props.cursor.locked) this.redraw();
      },
      deep: true,
    },
    overlays: {
      // Track changes in calc() functions
      handler: function (ovs) {
        for (var comp of Object.values(this.$refs)) {
          if (typeof comp.id !== "string") continue;
          let tuple = comp.id.split("_");
          tuple.pop();
          const name = tuple.join("_");

          ovs.forEach((ov) => {
            if (ov.name === name && ov.methods.calc) {
              let calc = ov.methods.calc.toString();
              if (calc !== ov.__prevscript__) {
                comp.exec_script();
              }
              ov.__prevscript__ = calc;
            }
          });
        }
      },
      deep: true,
    },
    // Redraw on the shader list change
    shaders() {
      this.redraw();
    },
  },
  created() {
    // List of all possible overlays (builtin + custom)
    this._list = [
      Spline,
      Splines,
      Range,
      Trades,
      Channel,
      Segment,
      Candles,
      Volume,
      Splitters,
      LineTool,
      RangeTool,
    ].concat(this.$props.overlays);
    this._registry = {};

    // We need to know which components we will use.
    // Custom overlay components overwrite built-ins:
    var tools = [];
    this._list.forEach((x, i) => {
      let use_for = x.methods.use_for();
      if (x.methods.tool)
        tools.push({
          use_for,
          info: x.methods.tool(),
        });
      use_for.forEach((indicator) => {
        this._registry[indicator] = i;
      });
    });
    this.$emit("custom-event", {
      event: "register-tools",
      args: tools,
    });
  },
  beforeDestroy() {
    if (this.renderer) this.renderer.destroy();
  },
  mounted() {
    const el = this.$refs["canvas"];
    this.renderer = new Grid(el, this);
    this.setup();
    this.$nextTick(() => this.redraw());
  },
  methods: {
    emit_custom_event(e) {
      this.on_ux_event(e, 'grid');
      this.$emit('custom-event', e);
    },
    new_layer(layer) {
      this.$nextTick(() => this.renderer.new_layer(layer));
    },
    del_layer(layer) {
      this.$nextTick(() => this.renderer.del_layer(layer));
      const grid_id = this.$props.grid_id;
      this.$emit("custom-event", {
        event: "remove-shaders",
        args: [grid_id, layer],
      });
      // TODO: close all interfaces
      this.$emit("custom-event", {
        event: "remove-layer-meta",
        args: [grid_id, layer],
      });
      this.remove_all_ux(layer);
    },
    get_overlays(h) {
      // Distributes overlay data & settings according
      // to this._registry; returns compo list
      const comp_list = [];
      const count = {};

      for (var d of this.$props.data) {
        let comp = this._list[this._registry[d.type]];
        if (comp) {
          if (comp.methods.calc) {
            comp = this.inject_renderer(comp);
          }
          comp_list.push({
            cls: comp,
            type: d.type,
            data: d.data,
            settings: d.settings,
            i0: d.i0,
            tf: d.tf,
            last: d.last,
          });
          count[d.type] = 0;
        }
      }
      return comp_list.map((x, i) =>
        h(x.cls, {
          ref: `${x.type}_${count[x.type]}`,
          id: `${x.type}_${count[x.type]++}`,
          type: x.type,
          data: x.data,
          settings: x.settings,
          i0: x.i0,
          tf: x.tf,
          num: i,
          grid_id: this.$props.grid_id,
          meta: this.$props.meta,
          last: x.last,
          ...this.common_props(),
          ...this.layer_events,
        })
      );
    },
    common_props() {
      return {
        cursor: this.$props.cursor,
        colors: this.$props.colors,
        layout: this.$props.layout.grids[this.$props.grid_id],
        interval: this.$props.interval,
        sub: this.$props.sub,
        font: this.$props.font,
        config: this.$props.config,
      };
    },
    emit_ux_event(e) {
      let e_pass = this.on_ux_event(e, "grid");
      if (e_pass) this.$emit("custom-event", e);
    },
    // Replace the current comp with 'renderer'
    inject_renderer(comp) {
      let src = comp.methods.calc();
      if (!src.conf || !src.conf.renderer || comp.__renderer__) {
        return comp;
      }

      // Search for an overlay with the target 'name'
      let f = this._list.find((x) => x.name === src.conf.renderer);
      if (!f) return comp;

      comp.mixins.push(f);
      comp.__renderer__ = src.conf.renderer;

      return comp;
    },
  },
  render() {
    const id = this.$props.grid_id;
    const layout = this.$props.layout.grids[id];

    return this.create_canvas(h, `grid-${id}`, {
      position: {
        x: 0,
        y: layout.offset || 0,
      },
      attrs: {
        width: layout.width,
        height: layout.height,
        overflow: "hidden",
      },
      style: {
        backgroundColor: this.$props.colors.back,
      },
      hs: [
        h(Crosshair, {
          ...this.common_props(),
          ...this.layer_events,
        }),
        h(KeyboardListener, {
          ...this.keyboard_events,
        }),
        h(UxLayer, {
          id,
          tv_id: this.$props.tv_id,
          uxs: this.uxs,
          colors: this.$props.colors,
          config: this.$props.config,
          updater: Math.random(),
          onCustomEvent: this.emit_ux_event,
        }),
      ].concat(this.get_overlays(h)),
    });
  },
};
</script>
