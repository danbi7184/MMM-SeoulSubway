const NodeHelper = require("node_helper");
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
				var queryParams = "/" + payload.config.key +
                          "/json/realtimeStationArrival" +
                          "/" + payload.config.start_index +
                          "/" + payload.config.end_index +
                          "/" + payload.config.statnNm;
				var url = payload.config.Sample + queryParams;
        request({
            url: url,
            method: 'GET',
        }, function (error, response, body) {
            if(!error){
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
