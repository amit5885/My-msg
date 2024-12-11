import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to DB");
    return;
  }

  try {
    const db = await mongoose.connect(
      (process.env.MONGODB_URI as string) || "",
    );
    // console.log("db: ", db);
    // console.log("db connections: ", db.connections);
    connection.isConnected = db.connections[0].readyState;

    console.log("DB Connected Successfully");
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    console.log("Database connection failed");
    process.exit(1);
  }
}

dbConnect();
