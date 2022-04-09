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
				queryParams += "/json/realtimeStationArrival";
				queryParams += "/" + payload.config.start_index;
				queryParams += "/" + payload.config.end_index;
				queryParams += "/" + payload.config.statnNm;
				var url = payload.config.Sample + queryParams;
        request({
            url: url,
            method: 'GET'
        }, function (error, response, body) {
            if(!error & (response && response.statusCode) === 200){
                var data = JSON.parse(body);
                if(data.hasOwnProperty("realtimeArrivalList")) {
                    var realtimeArrivalList = data.realtimeArrivalList;
                    self.sendSocketNotification("SUBWAY_DATA", realtimeArrivalList);
                } else {
                    self.sendSocketNotification("SUBWAY_DATA_ERROR", data);
                }
            }
        });
    },


});
