module.exports = function (app) {

    var models = require("./models/models.js")();

    var userService = require("./services/user.service.server.js")(app, models);
    var websiteService = require("./services/website.service.server.js")(app, models);
    var pageService = require("./services/page.service.server.js")(app, models);
    var widgetService = require("./services/widget.service.server.js")(app, models);
    
    app.get("/say/:message", function (req, res) {
        var msg = req.params["message"];
        res.send({message: msg});
        console.log(msg);
    });
};