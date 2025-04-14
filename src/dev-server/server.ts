import { Application, Router, send } from "oak";

import { getPlaylistItems } from "../playlist-generator/fetch-items.ts";
import { getEnvironmentVariable } from "../utils/environment.ts";

const app = new Application();
const router = new Router();

router.get("/items", async (ctx) => {
  ctx.response.headers.set("Content-Type", "application/json");

  let items;

  try {
    const data = await Deno.readTextFile("./items.json");

    console.log("Items file already exists, returning it.");
    ctx.response.body = JSON.parse(data);
  } catch {
    console.log("Playlist items doesn't exist. Fetching it...");
    const playlistId = getEnvironmentVariable("PLAYLIST_ID");

    items = await getPlaylistItems(playlistId);
    ctx.response.body = items;
  }
});

router.get("/", async (ctx) => {
  await send(ctx, "src/ui/index.html", {
    root: Deno.cwd(),
  });
});

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 9000;
console.log(`🚀 Server running at http://localhost:${port}`);
await app.listen({ port });
