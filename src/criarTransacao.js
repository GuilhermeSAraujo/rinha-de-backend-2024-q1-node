import { Mutex } from "async-mutex";
import { getDb } from "./db.js";

const mutex = new Mutex();

export async function criarTransacao(request, reply) {
  const { id } = request.params;

  validarEntradas(id, request.body);

  const { valor, tipo, descricao } = request.body;

  const idCliente = parseInt(id);

  const db = getDb();

  // const cliente = await db.findOne({ idCliente });

  let novaTransacao = {
    tipo,
    valor,
    descricao,
    realizada_em: new Date(),
  };

  // let novoSaldo = 0;
  // if (novaTransacao.tipo == "c") {
  //   novoSaldo = cliente.saldo + novaTransacao.valor;
  // } else {
  //   novoSaldo = cliente.saldo - novaTransacao.valor;
  //   // console.log({ valor, novoSaldo, cliente, novaTransacao });
  //   if (novoSaldo < cliente.limite * -1) return reply.status(422).send();
  // }

  const release = await mutex.acquire();

  let cliente = await db.findOneAndUpdate(
    {
      idCliente,
      $expr: { $gte: ["$saldo", { $multiply: ["$limite", -1] }] },
    },
    {
      $inc: { saldo: -valor },
      $push: { ultimas_transacoes: novaTransacao },
    },
    {
      returnOriginal: false,
      returnDocument: "after",
    }
  );

  release();
  console.log({ cliente });

  return reply
    .status(200)
    .send({ limite: cliente.limite, saldo: cliente.saldo });
}

function validarEntradas(id, body) {
  let idCliente;
  try {
    idCliente = parseInt(id);

    if (idCliente < 1 || idCliente > 5) return reply.status(404).send();
  } catch {
    return reply.status(404).send();
  }

  const { valor, tipo, descricao } = body;
  if (tipo != "c" && tipo != "d") return reply.status(422).send();

  if (!descricao || descricao.length > 10) return reply.status(422).send();

  if (valor % 1 != 0) return reply.status(422).send();
}
