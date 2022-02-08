<script>
import { markRaw } from 'vue';
import Overlay from "../../../src/mixins/overlay.js";
import Ux from "./Ux.vue";

export default {
  name: "PertTestUx",
  mixins: [Overlay],
  emits: ["new-interface"],
  methods: {
    meta_info() {
      return { author: "C451", version: "1.0.0" };
    },
    init() {
      this.custom_event("new-interface", {
        target: "grid",
        component: markRaw(Ux),
        pin: ["50px", "70px"],
        pin_position: "0,0",
      });
    },
    use_for() {
      return ["PerfTestUx"];
    },
  },
};
</script>
