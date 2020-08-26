const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

const Koa = require("koa");
const path = require("path");
const fs = require("fs");
const cors = require("@koa/cors");
const Router = require("@koa/router");
const { getRandomInt } = require("./utils");

const app = new Koa();
const router = new Router();

app.use(cors());

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// response

router.get("/random", async (ctx) => {
  const randomInt = getRandomInt(0, 6);
  if (randomInt > 2)
    await new Promise((resolve) => setTimeout(() => resolve(), 3000));
  ctx.body = { url: `${BASE_URL}/${randomInt}.jpeg` };
});

router.get("/:file", (ctx) => {
  const filePath = path.join(__dirname, ctx.params.file);
  ctx.type = path.extname(filePath);
  ctx.body = fs.createReadStream(filePath);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
