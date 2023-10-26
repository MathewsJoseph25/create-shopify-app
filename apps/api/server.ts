import express, { Request, Response } from 'express'
import('./config')
import('./init')
import { urlRouter } from './apiRouter'
import { ShopifyWebhooksHandler } from './webhooks'
const app = express()
const port = process.env.PORT || 8080

app.use((req, res, next) => {
  //setting up http headers to facilitate api calls
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization',
  )
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, POST, GET, OPTIONS')
  res.header('HTTP/1.1 200 OK')

  res.header(
    'Content-Security-Policy',
    `frame-ancestors https://${req.query.shop} https://admin.shopify.com;`,
  )

  // Pass to next layer of middleware
  next()
})

app.options('*', (_, res) => {
  // browsers call this route to check if the api call allows the cors
  res.sendStatus(200)
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from create-shopify-app api route!')
})

app.use(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  ShopifyWebhooksHandler,
)

app.use(express.json(), urlRouter)

app.listen(port, () => {
  console.log(`Shopify app listening on port ${port}...`)
})
