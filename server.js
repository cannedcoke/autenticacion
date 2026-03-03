// importo dependencias 

const express = require("express")

const app = express()

const routes = require("./routes/router")

const path = require("path")

const cookieParser = require("cookie-parser");

const { csrfProtection, csrfSecret } = require("./middlewares/csrf");

const helmet = require("helmet"); 

// con helmet le digo a mi browser que solo acepte contenido de mi dominio
app.use(helmet()); 
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
    imgSrc: ["'self'"],
    frameAncestors: ["'none'"], 
  }
}));


app.use(express.json())


app.use(cookieParser());
// serve views
app.use(express.static(path.join(__dirname, "views")));

// Serve CSS files
app.use("/css", express.static(path.join(__dirname, "static/css")));

// Serve JS files
app.use("/js", express.static(path.join(__dirname, "static", "js")));

app.use("/logging",routes)

app.use("/dashboard",routes)

// el csrf token se obtiene y envia al front
app.get("/csrf-token", (req, res) => {
    const token = csrfProtection.create(csrfSecret);
    res.json({ csrfToken: token });
});


app.listen(5000, ()=>{

    // se ejecuta cuando el servidor arranca correctamente
    console.log("Server running http://localhost:5000");
});

