const express = require("express");
const router = express.Router();
const multer = require("multer");
const Image = require("../models/Image");
const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authUser = require("../middleware/auth");

//multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

//Routes
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const salt = bcrypt.genSaltSync();
    const hashPwd = bcrypt.hashSync(password, salt);

    const data = { firstname, lastname, email, password: hashPwd };
    // console.log("client data", data);

    const newUser = await User.create(data);
    if (newUser) {
      res.status(201).json({ message: "user created" });
    } else {
      console.log("User not created!");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log("Error!" + error.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      console.log("Cannot find user details");
      // res.status(404).json({ message: "User not found!!" });
    }

    const dehashed = await bcrypt.compare(password, findUser.password);
    if (!dehashed) {
      console.log("wrong credentials");
    }

    if (findUser && dehashed) {
      const { password: hash, ...userData } = findUser._doc;

      const token = jwt.sign(
        { user: userData },
        process.env.ACCESS_SECRET_TOKEN
      );

      res
        .cookie("access_token", token)
        .json({ user: userData, message: "user logined!!" });
    } else {
      console.log("User not logined!!");
    }
  } catch (error) {
    console.log("Error!" + error.message);
  }
});

router.get("/profile", async (req, res) => {
  const { access_token } = await req.cookies;

  jwt.verify(access_token, process.env.ACCESS_SECRET_TOKEN, {}, (err, info) => {
    if (err) throw err;

    // console.log("info", info.user);
    res.status(200).json(info.user);
  });
});

router.get("/user", async (req, res) => {
  try {
    const allPosts = await Post.find()
      .populate("image")
      .sort({ createdAt: -1 });

    // console.log(allPosts);

    res.status(200).json(allPosts);
  } catch (error) {
    console.log("Error:" + error.message);
  }
});

router.post("/posts", authUser, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
    const imageUpload = new Image({ imageUrl });
    await imageUpload.save();

    const { title, description, tags } = req.body;
    const userId = req.user._id;

    const dbData = await Post.create({
      title,
      description,
      tags,
      image: imageUpload._id,
      user: userId,
    });

    const poppost = await Post.findById(dbData._id).populate("image");

    if (poppost) {
      res.status(201).json(poppost);
    } else {
      console.log("Post not created");
    }
  } catch (error) {
    console.log("Error!!" + error.message);
  }
});

router.get("/posts", async (req, res) => {
  try {
    const allPosts = await Post.find()
      .populate(["image", "user"])
      .sort({ createdAt: -1 });

    // console.log(allPosts);

    res.status(200).json(allPosts);
  } catch (error) {
    console.log("Error:" + error.message);
  }
});

module.exports = router;
