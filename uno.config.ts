import { defineConfig, presetIcons, presetUno } from 'unocss'

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
    breakpoints: {
      'xs': '320px',
      'sm': '600px',
      'md': '840px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  presets: [
    presetUno({
      dark: {
        light: '[data-theme=light]',
        dark: '[data-theme=dark]',
      },
    }),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': '-0.2em',
      },
    }),
  ],
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // 参考：https://unocss.dev/guide/extracting#extracting-from-build-tools-pipeline
        'src/utils/config.ts',
      ],
      // exclude files
      // exclude: []
    },
  },
})
