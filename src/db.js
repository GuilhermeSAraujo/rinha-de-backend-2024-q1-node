import { MongoClient } from "mongodb";
const url = "mongodb://rinha:123@mongo:27017";
// const url = "mongodb://rinha:123@localhost:27017";

let _db;

export async function connectToServer() {
  try {
    const client = await MongoClient.connect(url);
    _db = client.db("rinha").collection("transacoes");
    // _db.findOne();
  } catch (err) {
    console.error(err);
  }
}

export function getDb() {
  return _db;
}
