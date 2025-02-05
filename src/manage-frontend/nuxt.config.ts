export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      title: '秋鹿管理アプリ',
      link: [
        // ファビコンの設定
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
});
