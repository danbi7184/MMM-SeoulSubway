const NodeHelper = require("node_helper");
const convert = require('xml-js');
const request = require('request');

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        switch (notification) {
            case "GET_SUBWAY_DATA":
                let self = this;
                self.getData(payload);
                break;
        }
    },

    getData: async function (payload) {
				let self = this;
				var queryParams = "/" + payload.config.key;
				queryParams += "/xml/realtimeStationArrival"
				queryParams += "/" + payload.config.start_index;
				queryParams += "/" + payload.config.end_index;
				queryParams += "/" + payload.config.statnNm;
				var url = payload.config.Sample + queryParams;
        request({
            url: url,
            method: 'GET'
        }, function (error, response, body) {
            if(!error && (response && response.statusCode) == 200){
                var result = convert.xml2json(body, { compact: true, spaces: 4 });
                var data = JSON.parse(result).response
                if(data.hasOwnProperty("msgBody") && Array.isArray(data.msgBody.row)) {
                    var row = data.msgBody.row;
                    self.sendSocketNotification("SUBWAY_DATA", row);
                } else {
                    self.sendSocketNotification("SUBWAY_DATA_ERROR", data);
                }
            }
        });
    },


});
