const path = require("node:path")

const express = requre("express")

const app = express()


app.use(express.json())

const path = require("path")

app.use("/js",express.static(path.join(__dirname,"js")));

const routes = require("./routes/router")

app.use("/logging",routes)


app.listen(5000, ()=>{

    // se ejecuta cuando el servidor arranca correctamente
    console.log("Server running http://localhost:5000");
});

