import mongoose from "mongoose";

async function connect() {
  const db = await mongoose.connect(
    "mongodb+srv://admin:admin@cluster0.2yfgxuc.mongodb.net/e_store_dashboard?retryWrites=true&w=majority"
  );

  console.log("Database Connected");
  return db;
}

export default connect;
