
const express = require("express")

const app = express()

const routes = require("./routes/router")

const path = require("path")

const cookieParser = require("cookie-parser");

app.use(express.json())

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "views")));

// Serve CSS files
app.use("/css", express.static(path.join(__dirname, "static/css")));

// Serve JS files
app.use("/js", express.static(path.join(__dirname, "static", "js")));

app.use("/logging",routes)

app.use("/dashboard",routes)



app.listen(5000, ()=>{

    // se ejecuta cuando el servidor arranca correctamente
    console.log("Server running http://localhost:5000");
});

