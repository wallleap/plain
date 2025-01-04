import { defineComponent, h, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'Notify',
  props: {
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'info',
    },
    duration: {
      type: Number,
      default: 3000,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const show = ref(false)
    onMounted(() => {
      show.value = true
      setTimeout(() => {
        show.value = false
        props.onClose()
      }, props.duration)
    })
    return { show }
  },
  render() {
    return this.show
      ? h('transition', { name: 'fade' }, h('div', { class: `notify notify-${this.type}` }, [
        h('div', { class: 'notify-content' }, this.message),
      ]))
      : null
  },
})
