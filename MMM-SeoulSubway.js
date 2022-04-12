Module.register("MMM-SeoulSubway", {
  requiresVersion: "2.12.0",
  default: {
    sample: "http://swopenapi.seoul.go.kr/api/subway",
    key: "",
    startIndex: 0,
    endIndex: 1,
    statnNm: "사당",
    header: "사당역 지하철 도착 정보",
    updateInterval: 60000,
  },

  getStyles: function () {
    return ["MMM-SeoulSubway.css"];
  },

  getHeader: function () {
    if (this.subwayInfo) {
      return "<i class='fa fa-fw fa-bus'></i> " + this.config.header;
    }
    return "<i class='fa fa-fw fa-bus'></i> 지하철 정보";
  },

  start: function () {
    Log.info("Starting module: " + this.name);
    this.subwayInfo = [];
    var self = this;
    this.loaded = false;
  },

  getDom: function () {
    var wrapper = document.createElement("div");
    if (!this.loaded) {
      return wrapper;
    }
    var subwayTable = document.createElement("table");
    subwayTable.className = "small";
    var subway = this.subwayInfo;
    var RowArr = ['Row1', 'Row2'];
    var updnLineArr = ['updnLine1', 'updnLine2'];
    for(var i=0; i<2; i++)
    {
      if (subway[i].statnNm._text == this.config.statnNm) {
        RowArr[i] = document.createElement("tr");
        RowArr[i].className = "title bright";
        subwayTable.appendChild(RowArr[i]);

        // 상하행선 구분
        updnLineArr[i] = document.createElement("td");
        updnLineArr[i].innerHTML = subway.updnLine._text;
        RowArr[i].appendChild(updnLineArr[i]);

        // 도착지 방면 (성수행-구로디지털단지방향)
        //var trainLineNm = document.createElement("td");
        //trainLineNm.className = "trainLine";
        //trainLineNm.innerHTML = subway.trainLineNm._text;
        //tableRow.appendChild(trainLineNm);

        // 전역 진입, 전역 도착 혹은 몇분 후 도착
        //var arvlMsg2 = document.createElement("td");
      //  arvlMsg2.className = "arriving";
       // arvlMsg2.innerHTML = subway.arvlMsg2._text;
      // tableRow.appendChild(arvlMsg2);
      }
    }
    wrapper.appendChild(subwayTable);
    return wrapper;
  },

  getSubwayInfo: function () {
    Log.info("Requesting subway info");
    this.sendSocketNotification("GET_SUBWAY_DATA", {
      config: this.config,
      identifier: this.identifier,
    });
  },

  notificationReceived: function (notification, payload, sender) {
    switch (notification) {
      case "DOM_OBJECTS_CREATED":
        this.getSubwayInfo();
        var timer = setInterval(() => {
          this.getSubwayInfo();
        }, this.config.updateInterval);
        break;
    }
  },

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "SUBWAY_DATA":
        this.loaded = true;
        console.log("NotificationReceived:" + notification);
        this.subwayInfo = payload;
        this.updateDom();
        break;
      case "SUBWAY_DATA_ERROR":
        this.updateDom();
        break;
    }
  },
});
