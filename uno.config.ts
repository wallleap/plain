import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  rules: [
    // mask
    [/^mask-s$/, () => ({
      '-webkit-mask': 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
    })],
    // slide-enter
    [/^slide-enter-(\d+)$/, ([, d]) => {
      return {
        'animation-name': 'slideInBottom',
        'animation-duration': '2s',
        'animation-delay': `${d}`,
        'animation-fill-mode': 'forwards',
        'animation-iteration-count': '1',
        'animation-direction': 'normal',
        'animation-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
      }
    }],
    // 多行文本超出部分省略号 line-n
    [/^line-(\d+)$/, ([, l]) => {
      if (~~l === 1) {
        return {
          'overflow': 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
          'width': '100%',
        }
      }
      return {
        'overflow': 'hidden',
        'display': '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': l,
      }
    }],
  ],
  theme: {
    colors: {
      primary: 'var(--primary)',
    },
    animation: {
      // 闪烁
      keyframes: {
        'blink': '{ 0% { opacity: 0; } 100% { opacity: 1; }}',
        'slide-in-bottom': '{ 0% { transform: translateY(-30px) } 0% { transform: translateY(0px) }}',
      },
      durations: {
        'my-animation': '0.8s',
      },
      counts: {
        'my-animation': 'infinite',
      },
      timingFns: {
        'my-animation': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
      },
    },
  },
  presets: [
    presetUno({
      dark: {
        light: '[data-theme=light]',
        dark: '[data-theme=dark]',
      },
    }),
  ],
})
