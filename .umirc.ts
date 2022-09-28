import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'yarn',
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {
    // dark: true,
    import: true,
  },
});

