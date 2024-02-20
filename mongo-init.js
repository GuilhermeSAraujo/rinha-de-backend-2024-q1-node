conn = new Mongo();
db = conn.getDB("rinha");

db.transacoes.insertMany([
  {
    idCliente: 1,
    limite: 1000 * 100,
    ultimas_transacoes: [],
    saldo: 0,
  },
  {
    idCliente: 2,
    limite: 800 * 100,
    ultimas_transacoes: [],
    saldo: 0,
  },
  {
    idCliente: 3,
    limite: 10000 * 100,
    ultimas_transacoes: [],
    saldo: 0,
  },
  {
    idCliente: 4,
    limite: 100000 * 100,
    ultimas_transacoes: [],
    saldo: 0,
  },
  {
    idCliente: 5,
    limite: 5000 * 100,
    ultimas_transacoes: [],
    saldo: 0,
  },
]);
