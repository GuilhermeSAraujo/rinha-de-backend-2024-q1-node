export async function criarTransacao(request, reply) {
  const { idUsuario } = request.params;
  if (idUsuario < 1 || idUsuario > 5) return reply.status(404).send();

  //   const dadosCliente = await

  const { valor, tipo, descricao } = request.body;

  return reply.status(200).send({ valor, tipo, descricao });
}

const { MongoClient } = require("mongodb");

async function createTransaction(newTransaction) {
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const transactionsCollection = client
      .db("yourDB")
      .collection("transactions");

    // Find the last transaction for the client and increment the saldo atomically
    const result = await transactionsCollection.findAndModify(
      { idCliente: newTransaction.idCliente },
      [["_id", "desc"]],
      { $inc: { saldo: newTransaction.valor } },
      { new: true }
    );

    if (result.value) {
      // If a document was found and updated, return the new saldo
      return result.value.saldo;
    } else {
      // If no document was found, this is the first transaction for the client
      // Insert a new document with the initial saldo equal to the valor of the transaction
      newTransaction.saldo = newTransaction.valor;
      await transactionsCollection.insertOne(newTransaction);
      return newTransaction.saldo;
    }
  } catch (error) {
    console.error("Error processing transaction", error);
    throw error;
  } finally {
    await client.close();
  }
}

/*
// limite fixo
{
    idCliente: int,
    valor: int,
    saldo: int,
    tipo: char,
    descricao: string,
    data: string
}
*/
