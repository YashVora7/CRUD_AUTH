const express = require('express');
const connect = require('./db');
const userModel = require('./user');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const auth = require('./middleware');

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    try {
        const data = await userModel.find();
        res.send(data);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const data = await userModel.findOne({ email: email });
        if (data) {
            res.status(400).send("User already registered");
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    res.status(500).send("Error Found");
                } else {
                    const newUser = await userModel.create({name: name, email: email, password: hash });
                    res.send(newUser);
                }
            });
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err || !result) {
                    res.status(401).send("Invalid Password");
                } else {
                    const token = jwt.sign({ email: email }, "your_secret_key");
                    res.send({ token: token });
                }
            });
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.post("/private", auth, async (req, res) => {
    console.log('????????????')
    try {
        const newUser = await userModel.create(req.body);
        res.send(newUser);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.patch('/update/:id', async (req, res) => {
    try {
        const update = await userModel.findByIdAndUpdate(req.params.id, req.body);
        res.send(update);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const del = await userModel.findByIdAndDelete(req.params.id);
        res.send(del);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connect();
    console.log(`Listening on port ${PORT}`);
});
