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

    getStyles: function() {
        return ["MMM-SeoulSubway.css"];
    },

    getHeader: function() {
        if (this.subwayInfo) {
            return "<i class='fa fa-fw fa-bus'></i> " + this.config.header;
        }
        return "<i class='fa fa-fw fa-bus'></i> 지하철 정보";
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.subwayInfo = [];
        this.loaded = false;
    },

	getDom: function() {
		var wrapper = document.createElement("div");
        if (!this.loaded) {
            return wrapper;
        }
        var subwayTable = document.createElement("table");
        subwayTable.className = "small";
        if(this.subwayInfo.length > 0) {
            for (var t in this.subwayInfo) {
              var subway = this.subwayInfo[t];
              if (subway.statnNm._text == this.config.statnNm) {
                var row = document.createElement("tr");
                row.className = "title bright";
                subwayTable.appendChild(row);

                // 도착지 방면 (성수행-구로디지털단지방향)
                //var trainLineNm = document.createElement("td");
                //trainLineNm.className = "trainLine";
                //trainLineNm.innerHTML = subway.trainLineNm._text;
                //row.appendChild(trainLineNm);

                // 상하행선 구분
                var updnLine = document.createElement("td");
                updnLine.className = "white_txt";
                updnLine.innerText = subway.updnLine._text;
                row.appendChild(updnLine);

                // 전역 진입, 전역 도착 혹은 몇분 후 도착
                var arvlMsg2 = document.createElement("td");
                arvlMsg2.className = "arriving";
                arvlMsg2.innerHTML= subway.arvlMsg2._text + "입니다";
                row.appendChild(arvlMsg2);
              }
            }
        }
        wrapper.appendChild(subwayTable);
		        return wrapper;
	},

    getSubwayInfo: function() {
        Log.info("Requesting subway info");
        this.sendSocketNotification("GET_SUBWAY_DATA",
            {
                "config": this.config,
                "identifier": this.identifier
            }
        )
    },

	notificationReceived: function(notification, payload, sender){
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
    }
})
