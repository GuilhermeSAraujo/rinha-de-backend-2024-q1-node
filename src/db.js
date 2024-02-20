import { MongoClient } from "mongodb";
const url = "mongodb://rinha:123@mongo:27017";
// const url = "mongodb://rinha:123@localhost:27017";

let _db;

export async function connectToServer() {
  let connected = false;
  while (!connected) {
    try {
      console.log("Trying to stablish connection with db...");
      const client = await MongoClient.connect(url);
      _db = client.db("rinha").collection("transacoes");
      connected = true;
      console.log("Connected succefully...");
    } catch (err) {
      console.log("Waiting for database connection...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

export function getDb() {
  return _db;
}
