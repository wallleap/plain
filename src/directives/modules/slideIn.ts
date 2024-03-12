const DISTANCE = 150
const DURATION = 1000
const animationMap = new WeakMap()
const ob = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const animation = animationMap.get(entry.target)
      if (animation)
        animation.play()
      ob.unobserve(entry.target)
    }
  })
})

function isBelowViewPort(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return rect.top > window.innerHeight
}

export default {
  mounted(el: HTMLElement) {
    if (isBelowViewPort(el)) {
      const animation = el.animate([
        { transform: `translateY(${DISTANCE}px)`, opacity: 0 },
        { transform: `translateY(0)`, opacity: 1 },
      ], {
        duration: DURATION,
        easing: 'ease',
      })
      animation.pause()
      animationMap.set(el, animation)
      ob.observe(el)
    }
  },
  unmounted(el: HTMLElement) {
    ob.unobserve(el)
  },
}
