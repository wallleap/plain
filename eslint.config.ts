import antfu from '@antfu/eslint-config'

export default antfu(
  {
    stylistic: {
      indent: 2,
      quotes: 'single',
    },
    vue: true,
    typescript: true,
    unocss: true,
  },
)
