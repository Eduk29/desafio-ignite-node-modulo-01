import http from "node:http";

import { bufferConverter } from "./middleware/buffer-converter.js";
import { routes } from "./routes.js";
import { extractQueryParameters } from "./utils/extract-query-parameters.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method !== "DELETE" && method !== "PATCH") {
    await bufferConverter(req, res);
  }

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParam = req.url.match(route.path);
    const { query, ...params } = routeParam.groups;

    req.params = params;
    req.query = query ? extractQueryParameters(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
