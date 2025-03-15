import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

const UNAUTHORIZED_RESPONSE = new Response("Autorização necessária", {
  status: 401,
  headers: { "WWW-Authenticate": 'Basic realm="Secure area"' },
});

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
  if (!authHeaders) return UNAUTHORIZED_RESPONSE;

  const base64Credentials = authHeaders.split(" ").at(-1);
  console.log("Base64 Credentials:", base64Credentials);

  if (!base64Credentials) return UNAUTHORIZED_RESPONSE;

  const decodedCredentials = atob(base64Credentials).split(":");
  console.log("Decoded Credentials:", decodedCredentials);

  if (decodedCredentials.length !== 2) return UNAUTHORIZED_RESPONSE;

  const [user, password] = decodedCredentials;
  return user === "admin" && password === "admin"
    ? next()
    : UNAUTHORIZED_RESPONSE;
};

const privateRoutes = new Set(["/protected"]);

export const onRequest = defineMiddleware(async ({ url, request }, next) => {
  const isPrivateRoute = privateRoutes.has(url.pathname);
  const authHeader = request.headers.get("authorization") ?? "";

  return isPrivateRoute ? checkLocalAuth(authHeader, next) : next();
});
