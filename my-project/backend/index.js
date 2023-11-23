const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();


const app = express();
// const corsOptions = {
//   origin: "http://localhost:5173",
// };

// app.use(cors(corsOptions));

app.use(cors());
app.use(express.json({ limit: "10mb" }));


const PORT = process.env.PORT || 8080;

//Connect to manogodb
console.log(process.env.MONGODB_URL)
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Succesfully your  MongoDb database server connected :) "))
  .catch((err) => console.log(err));


  //schema of data
  const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    confirmPassword: String,
    image: String,
  });

  //model for schema
  const userModel = mongoose.model("user", userSchema);





app.get("/",(req,res)=>{
    res.send("server is running inss")
})

//API for Sign up page
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  
  try {
    const existingUser = await userModel.findOne({ email: email }).exec();
    if (existingUser) {
      return res.send({ message: "This email is already registered",alert : false });
    }

    const newUser = new userModel(req.body);
    await newUser.save();
    res.send({ message: "Successfully signed up",alert : true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error signing up" });
  }
});

//api for login
// app.post("/login", (req, res) => {
//   // console.log(req.body);
//   const { email } = req.body;
//   userModel.findOne({ email: email }, (err, result) => {
//     if (result) {
//       const dataSend = {
//         _id: result._id,
//         firstName: result.firstName,
//         lastName: result.lastName,
//         email: result.email,
//         image: result.image,
//       };
//       console.log(dataSend);
//       res.send({
//         message: "Login is successfully",
//         alert: true,
//         data: dataSend,
//       });
//     } else {
//       res.send({
//         message: "Email is not available, please sign up",
//         alert: false,
//       });
//     }
//   });
// });
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if the email exists in the database
    const user = await userModel.findOne({ email });

    if (user) {
      // Here, you would typically compare the provided password with the hashed password stored in the database.
      // If the password matches, you can proceed with authentication.

      // For demonstration purposes, we'll just send a success response.
      const dataSend = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
      };

      res.status(200).json({
        message: "Login is successful",
        alert: true,
        data: dataSend,
      });
    } else {
      // If the email is not found in the database, send an error response.
      res.status(404).json({
        message: "Email not found, please sign up",
        alert: false,
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process (e.g., database errors).
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      alert: false,
    });
  }
});

//product section

const schemaProduct = mongoose.Schema({
  name: String,
  category:String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product",schemaProduct)


//save product in data

app.post("/uploadProduct",async(req,res)=>{
  console.log(req.body)
  const data = await productModel(req.body)
  const datasave = await data.save()
  console.log(datasave)
  res.send({message : "Upload successfully"})
})

// //
app.get("/product",async(req,res)=>{
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
  // res.send("working")
})


//TO check server is running or not
  app.listen(PORT , ()=> console.log("server is runnniggggg " + PORT))