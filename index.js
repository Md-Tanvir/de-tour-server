const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b0w5j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = process.env.PORT || 5000;
const app = express();
// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("De Tour Server Is Running");
});

client.connect((err) => {
  const servicesCollection = client.db("deTour").collection("services");
  const ordersCollection = client.db("deTour").collection("orders");

  // ADD NEW SERVICES

  app.post("/addServices", async (req, res) => {
    const result = await servicesCollection.insertOne(req.body);
    res.send(result);
  });

  // GET ALL SERVICES

  app.get("/services", async (req, res) => {
    const result = await servicesCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });

  // GET SINGLE SERVICE

  app.get("/singleService/:id", async (req, res) => {
    const result = await servicesCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(result[0]);
  });

  // CONFIRM YOUR ORDER

  app.post("/confirmOrder", async (req, res) => {
    const result = await ordersCollection.insertOne(req.body);
    res.send(result);
  });

  //   LOGGED USER ORDERS
  app.get("/myOrders/:email", async (req, res) => {
    const result = await ordersCollection
      .find({ email: req.params.email })
      .toArray();
    res.send(result);
  });

  // DELETE ANY ORDER

  app.delete("/delteOrder/:id", async (req, res) => {
    const result = await ordersCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

  //GET ALL ORDERS

  app.get("/allOrders", async (req, res) => {
    const cursor = ordersCollection.find({});
    const orders = await cursor.toArray();
    res.send(orders);
  });

  // UPDATE ORDER STATUS
  app.put("/allOrders/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const option = { upsert: true };
    const updateStatus = { $set: { status: "Approved" } };
    const result = await ordersCollection.updateOne(
      filter,
      updateStatus,
      option
    );
    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Server Is Running On Port:`,port);
});
