// @ts-check

import httpProxy from 'http-proxy'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { version } = require('../package.json')

const PORT = +(process.env?.PORT || 3000)

const proxy = httpProxy.createProxyServer({
  target: 'https://discord.com/api',
  changeOrigin: true,
})
proxy.on('proxyReq', (proxyReq, req, res) => {
  const host = req.headers.host
  if (!host) {
    res.statusCode = 400
    res.end('No host header')
    return
  }
  proxyReq.setHeader('User-Agent', `DiscordBot (${host}, ${version})`)
  proxyReq.setHeader('X-Forwarded-Host', host)

  const discordAuthorization = req.headers['discord-authorization']
  if (!discordAuthorization) {
    res.statusCode = 400
    res.end('No discord-authorization header')
    return
  }
  proxyReq.setHeader('Authorization', discordAuthorization)

  if (req.socket.remoteAddress) {
    proxyReq.setHeader('X-Forwarded-For', req.socket.remoteAddress)
  }
})

proxy.listen(PORT)
console.log(`Listening on port ${PORT}`)
