import html from '@web/rollup-plugin-html';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  output: { dir: 'dist' },
  plugins: [
    html({
      input: './dist-tsc/demo/index.html',
    }),
    nodeResolve(),
  ],
};
