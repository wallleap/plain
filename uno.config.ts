import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  rules: [
    // mask
    [/^mask-s$/, () => ({
      '-webkit-mask': 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
    })],
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
