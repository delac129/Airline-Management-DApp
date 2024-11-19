const routes = require("next-routes")();

routes
  .add("/flights/new", "/flights/new")
  .add("/flights/:address", "/flights/show");

module.exports = routes;
