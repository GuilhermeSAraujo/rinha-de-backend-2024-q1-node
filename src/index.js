import Fastify from "fastify";
import { criarTransacao } from "./criarTransacao.js";
import { connectToServer, getDb } from "./db.js";

const fastify = Fastify({
  // logger: true,
  // forceCloseConnections: true,
  // maxParamLength: 1,
});

fastify.post("/clientes/:id/transacoes", async (request, reply) => {
  await criarTransacao(request, reply);
});

fastify.get("/clientes/:idCliente/extrato", async (request, reply) => {
  const db = getDb();
  const idCliente = request.params.idCliente;
  if (idCliente < 1 || idCliente > 5) return reply.status(404).send();

  const result = await db.findOne({ idCliente: parseInt(idCliente) });
  
  const sortedTransactions = result.ultimas_transacoes.sort(
    (a, b) => b.realizada_em - a.realizada_em
  );

  const ultimas_transacoes = sortedTransactions.slice(0, 10);

  return reply.send({
    saldo: {
      total: result.saldo,
      data_extrato: new Date(),
      limite: result.limite,
    },
    ultimas_transacoes: {
      ultimas_transacoes,
    },
  });
});

fastify.get("/test", async (request, reply) => {
  const db = getDb();
  const data = await db.find().toArray();
  return reply.send(data);
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    await connectToServer();
    await fastify.listen({ port: 8080, host: "0.0.0.0" });
    fastify.log.info("Server is ready!");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
