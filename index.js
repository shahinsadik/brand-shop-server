const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://car-shop:wVabRXt00HIAP5Tm@cluster0.lz5tib6.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db("usersDb").collection("users");
    const carCollection = client.db("usersDb").collection("cars");
    const myCardCollection = client.db("usersDb").collection("my-cart");
    const brandCollection = client.db("usersDb").collection("brand");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
      console.log(result);
    });

    app.post("/cars", async (req, res) => {
      const user = req.body;
      const result = await carCollection.insertOne(user);
      res.send(result);
      console.log(result);
    });

    app.post("/my-cart", async (req, res) => {
      const user = req.body;
      const result = await myCardCollection.insertOne(user);
      res.send(result);
      console.log(result);
    });

    app.post("/brand", async (req, res) => {
      const brand = [
        {
          image: "https://ibb.co/8ctd440",
          name: "Toyota",
        },
        {
          image: "https://ibb.co/YZsHVZM",
          name: "Nissan",
        },
        {
          image: "https://ibb.co/9GKvp6L",
          name: "Ferrari",
        },
        {
          image: "https://ibb.co/Gnk7P8r",
          name: "Tesla",
        },
        {
          image: "https://ibb.co/CQVMzPP",
          name: "BMW",
        },
        {
          image: "https://ibb.co/LzYSCPV",
          name: "BMW",
        },
      ];
      const result = await brandCollection.insertMany(brand);
      res.send(result);
    });

    app.get("/brand", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get("/Brands/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const result = await carCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/cars", async (req, res) => {
      const result = await carCollection.find().toArray();
      res.send(result);
      console.log(result);
    });
    app.get("/my-cart", async (req, res) => {
      const result = await myCardCollection.find().toArray();
      res.send(result);
      console.log(result);
    });
    app.get("/my-cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myCardCollection.findOne(query);
      res.send(result);
      console.log(result);
    });

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.send(result);
      console.log(result);
    });

    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter= { _id: new ObjectId(id) };
      const options = { upSert: true };
      const updatedData = {
        $set: {
          name: data.name,
          price: data.price,
          photo: data.photo,
          description: data.description,
          rating: data.rating,
          carCategory: data.carCategory,
          brand: data.brand
          
        },
      };
      const result = await carCollection.updateOne(filter, updatedData, options)
      res.send(result);
    });

    app.delete("/my-cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myCardCollection.deleteOne(query);
      res.send(result);
      console.log(query, "delete id");
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
