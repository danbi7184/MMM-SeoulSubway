const NodeHelper = require("node_helper");
const convert = require("xml-js");
const request = require("request");

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node helper: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "GET_SUBWAY_DATA":
        let self = this;
        self.getData(payload);
        break;
    }
  },

  getData: async function (payload) {
    let self = this;
    var queryParams =
      "/" + payload.config.key +
      "/xml/realtimeStationArrival" +
      "/" + payload.config.startIndex +
      "/" + payload.config.endIndex +
      "/" + encodeURIComponent(payload.config.statnNm);
    var url = payload.config.sample + queryParams;
    request({
        url: url,
        method: "GET"
      }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var result = convert.xml2json(body, { compact: true, spaces: 4 });
          var data = JSON.parse(result).realtimeStationArrival;
          if (data.hasOwnProperty("row")) {
            var realtimeArrivalList = data.row;
            self.sendSocketNotification("SUBWAY_DATA", realtimeArrivalList);
          } else {
            self.sendSocketNotification("SUBWAY_DATA_ERROR", data);
          }
        }
      });
  },
});
