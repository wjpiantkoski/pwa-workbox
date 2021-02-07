const { generateSW } = require('workbox-build')

generateSW({
  swDest: 'app/sw.js',
  globDirectory: 'app',
  globPatterns: [
    '**/*.{html,css}',
    'main.js',
    'Classes/*.js'
  ],
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      urlPattern: /\.(css|js)$/,
      handler: 'cacheFirst'
    },
    {
      urlPattern: /^https:\/\/pro\.fontawesome\.com.*/,
      handler: 'staleWhileRevalidate',
      options: {
        cacheName: 'fontawesome'
      }
    }
  ]
})
.then(() => {
  console.log(`Generated new service worker`)
})
.catch(console.error)