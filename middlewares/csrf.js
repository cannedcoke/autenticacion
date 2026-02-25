// eme permite generar un csrf token 
const Csrf = require("csrf");
const csrfProtection = new Csrf();
const csrfSecret = csrfProtection.secretSync();

module.exports = { csrfProtection, csrfSecret };