
const express = require("express")

const app = express()


app.use(express.json())

const path = require("path")

app.use(express.static(path.join(__dirname, "views")));

// Serve CSS files
app.use("/css", express.static(path.join(__dirname, "static/css")));

// Serve JS files
app.use("/js", express.static(path.join(__dirname, "static", "js")));

const routes = require("./routes/router")

app.use("/logging",routes)


app.listen(5000, ()=>{

    // se ejecuta cuando el servidor arranca correctamente
    console.log("Server running http://localhost:5000");
});

