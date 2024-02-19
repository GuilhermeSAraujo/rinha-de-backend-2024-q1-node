import Fastify from "fastify";
import { criarTransacao } from "./criarTransacao.js";

const fastify = Fastify({
  logger: true,
});

fastify.route({
  method: "POST",
  url: "/clientes/:idUsuario/transacoes",
  schema: {
    params: {
      type: "object",
      required: ["idUsuario"],
      properties: {
        idUsuario: { type: "integer" },
      },
    },
    body: {
      type: "object",
      required: ["valor", "tipo", "descricao"],
      properties: {
        valor: { type: "integer" },
        tipo: { type: "string", enum: ["c", "d"] },
        descricao: { type: "string", maxLength: 10 },
      },
    },
  },
  handler: async function (request, reply) {
    return await criarTransacao(request, reply);
  },
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
