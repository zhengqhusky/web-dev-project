module.exports = function (app) {

    var widgets = [
        { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%", "url": "http://lorempixel.com/400/200/"},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%", "url": "https://youtu.be/AM2Ivdi9c4E" }
    ];

    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);

    function createWidget(req, res) {
        var newWidget = req.body;
        newWidget._id = (new Date().getTime).toString();
        widgets.push(newWidget);
        res.json(newWidget);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        var matchingWidgets = [];
        
        for (var i in widgets) {
            if (widgets[i].pageId === pageId) {
                matchingWidgets.push(widgets[i]);
            }
        }
        res.send(matchingWidgets);
    }

    function findWidgetById(req, res) {
        var id = req.params.widgetId;
        for (var i in widgets) {
            if (widgets[i]._id === id) {
                res.json(widgets[i]);
                return;
            }
        }
        res.send({});
    }

    function updateWidget(req, res) {
        var widget = req.body;
        var id = newWidget._id;
        for (var i in widgets) {
            if (widgets[i]._id === id) {
                widgets[i].name = widget.name;
                widgets[i].size = widget.size;
                widgets[i].text = widget.text;
                widgets[i].width = widget.width;
                widgets[i].url = widget.url;
                res.send(200);
                return;
            }
        }
        res.status(400).send("Widget with ID: " + id + " not found");
    }

    function deleteWidget(req, res) {
        var id = req.params.widgetId;
        for (var i in widgets) {
            if (widgets[i]._id === id) {
                widgets.splice(i, 1);
                res.send(200);
                return;
            }
        }
        res.status(400).send("Widget with ID: " + id + " not found");
    }
};