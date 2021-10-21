
// Html interface, shown on top of the grid.
// Can be static (a tooltip) or interactive,
// e.g. a control panel.

export default {
  props: ['ux', 'updater', 'colors', 'wrapper'],
  emits: ["custom-event"],
  computed: {
    overlay() {
      return this.$props.ux.overlay
    },
    layout() {
      return this.overlay.layout
    },
    uxr() {
      return this.$props.ux
    }
  },
  mounted() {
    if (this.init) this.init()
  },
  methods: {
    close() {
      this.custom_event('custom-event', {
        event: 'close-interface',
        args: [this.$props.ux.uuid]
      })
    },
    // TODO: emit all the way to the uxlist
    // add apply the changes there
    modify(obj) {
      this.custom_event('custom-event', {
        event: 'modify-interface',
        args: [this.$props.ux.uuid, obj]
      })
    },
    custom_event(event, ...args) {
      if (event.split(':')[0] === 'hook') return
      this.$emit('custom-event', { event, args })
    }
  },
}
