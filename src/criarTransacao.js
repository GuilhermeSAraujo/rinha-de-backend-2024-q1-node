import { getDb } from "./db.js";

export async function criarTransacao(request, reply) {
  const { idUsuario } = request.params;
  if (idUsuario < 1 || idUsuario > 5) return reply.status(404).send();

  const { valor, tipo, descricao } = request.body;

  const db = getDb();

  const cliente = await db.findOne({ idCliente: idUsuario });

  let novaTransacao = {
    tipo: tipo,
    valor: valor,
    descricao: descricao,
    realizada_em: new Date(),
  };

  let novoSaldo = 0;
  if (novaTransacao.tipo == "c") {
    novoSaldo = cliente.saldo + novaTransacao.valor;
  } else {
    novoSaldo = cliente.saldo - novaTransacao.valor;
    if (novoSaldo < cliente.limite * -1) return reply.status(422).send();
  }

  await db.updateOne(
    { idCliente: idUsuario },
    {
      $set: { saldo: novoSaldo },
      $push: { ultimas_transacoes: novaTransacao },
    }
  );

  return reply.status(200).send({ limite: cliente.limite, saldo: novoSaldo });
}
