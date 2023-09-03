const express = require('express');
const app = express();
const pgp = require("pg-promise")();
const bodyParser = require("body-parser");

const db = pgp('postgres://postgres:1234@localhost:5432/accountant');

app.use(express.static(__dirname + "/"))
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())

app.listen(3000, () => {
    console.log("server is running...")
})

app.get("/helloworld", (req, res) => {
    db.any("select * from ac_test")
    .then((data1) => {
        console.log(data1);
        return res.status(200).json(data1);
    })
    .catch((error1) => {
        console.log(error1);
        return res.status(400)
    })
})

app.post("/api/savestatement", (req, res) => {
    try {
        var type = req.body.type;
        var amount = req.body.amount;
        var img = req.body.img;

        if(type && amount && img) {
            var txn = "BL" + new Date().getTime();
            var doingtime = new Date() + "";
            var mil = new Date().getTime();
            amount = parseFloat(amount);
            db.any("insert into ac_transaction (txn, type, amount, img, doingtime, mil) values ($1,$4,$5,$6,$7,$8) returning * ",
            [txn, "", "", type, amount, img, doingtime, mil])
            .then((data1) => {
                return res.status(200).json({
                    code: 200,
                    message: "success"
                })
            })
            .catch(() => {
                return res.status(500).json({
                    code: 500,
                    message: "error"
                })
            })
        }
        else {
            return res.status(400).json({
                code: 400,
                message: "error"
            })
        }
    }
    catch(error) {
        return res.status(500).json({
            code: 500,
            message: "error"
        })
    }
})