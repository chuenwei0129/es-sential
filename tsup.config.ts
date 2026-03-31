import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'array/index': 'src/array/index.ts',
    'object/index': 'src/object/index.ts',
    'string/index': 'src/string/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: {
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },
  splitting: true,
  sourcemap: true,
  clean: true,
})
