import { defineMiddleware } from "astro:middleware";

// `context` e `next` são automaticamente tipados
export const onRequest = defineMiddleware(async (context, next) => {
  // console.log("⚠️ [Astro] Este código roda apenas no servidor.");

  // Continua para o próximo middleware ou para o handler da rota
  return next();
});
