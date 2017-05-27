require('./polyfill')

const Koa = require('koa')
const Logger = require('koa-logger')
const cors = require('kcors')
const Router = require('./router')

const app = new Koa()

app.use(cors())
app.use(Logger())
app.use(async (ctx, next) => {
  await next();

  ctx.body = { result: ctx.body }
})
app.use(Router.routes())

app.listen(process.env.PORT || 3000)

console.log('Server running at port: ' + (process.env.PORT || 3000))