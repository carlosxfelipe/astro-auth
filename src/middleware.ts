import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
  if (!authHeaders) {
    return new Response("Autorização necessária", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure area"',
      },
    });
  }

  const authValue = authHeaders.split(" ").at(-1) ?? "user:pass";
  console.log("authValue =>", authValue);
  const decodedValue = atob(authValue).split(":");
  console.log("decodedValue =>", decodedValue);

  return next();
};

const privateRoutes = ["/protected"];

export const onRequest = defineMiddleware(async ({ url, request }, next) => {
  // const isPrivateRoute = privateRoutes.some(route => url.pathname.startsWith(route));

  const authHeaders = request.headers.get("authorization") ?? "";

  if (privateRoutes.includes(url.pathname)) {
    return checkLocalAuth(authHeaders, next);
  }

  return next();
});
