import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  base: '/worklog',
  root: path.join(__dirname, 'docs'),
  outDir: path.join(__dirname, 'dist'),
  globalStyles: path.join(__dirname, 'styles/index.css'),
  title: 'Worklog',
  icon: 'https://avatars.githubusercontent.com/u/105040809',
  logo: 'https://avatars.githubusercontent.com/u/105040809',
  themeConfig: {
    enableScrollToTop: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/laplus-x',
      },
    ],
  },
  multiVersion: {
    default: 'latest',
    versions: ['latest'],
  },
  search: {
    versioned: true,
  },
  ssg: false,
  builderPlugins: [],
  builderConfig: {
    resolve: {
      alias: {
        '@': './src',
      },
    },
    dev: {
      hmr: true,
      liveReload: true,
      watchFiles: {
        paths: ['docs/**/*.md'],
        type: 'reload-page',
      },
    },
    output: {
      assetPrefix: '/worklog'
    }
  }
});
