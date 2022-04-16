Module.register("MMM-SeoulSubway", {
  requiresVersion: "2.12.0",
  default: {
    sample: "http://swopenapi.seoul.go.kr/api/subway",
    key: "",
    startIndex: 0,
    endIndex: 15,
    statnNm: "", // 역 이름
    header: "지하철 도착 정보",
    direction: "", // 방면
    updateInterval: 60000,
  },

  getStyles: function () {
    return ["MMM-SeoulSubway.css"];
  },

  getHeader: function () {
    if (this.subwayInfo) {
      return "<i class='fa fa-fw fa-subway'></i> " + this.config.header;
    }
    return "<i class='fa fa-fw fa-subway'></i> 지하철 정보";
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

    var RowArr = new Array();
    var updnLineArr = new Array();
    var trainLineNmArr = new Array();
    var arvlMsgArr = new Array();

    for(var i=0; i<subway.length; i++) {
      if (subway[i].trainLineNm._text.includes(this.config.direction) || !this.config.direction) {
        RowArr[i] = 'row' + i;
        updnLineArr[i] = 'updnLine' + i;
        trainLineNmArr[i] = 'trainLineNm' + i;
        arvlMsgArr[i] = 'arvlMsgArr' + i;

        RowArr[i] = document.createElement("tr");
        RowArr[i].className = "title bright";
        subwayTable.appendChild(RowArr[i]);

        // 상하행선, 내선외선 구분
        updnLineArr[i] = document.createElement("td");
        // 글씨 색을 각 호선에 맞는 색으로 설정
        if(subway[i].subwayId._text == "1001") {
          updnLineArr[i].className = "line1";
        } else if(subway[i].subwayId._text == "1002") {
          updnLineArr[i].className = "line2";
        } else if(subway[i].subwayId._text == "1003") {
          updnLineArr[i].className = "line3";
        } else if(subway[i].subwayId._text == "1004") {
          updnLineArr[i].className = "line4";
        } else if(subway[i].subwayId._text == "1005") {
          updnLineArr[i].className = "line5";
        } else if(subway[i].subwayId._text == "1006") {
          updnLineArr[i].className = "line6";
        } else if(subway[i].subwayId._text == "1007") {
          updnLineArr[i].className = "line7";
        } else if(subway[i].subwayId._text == "1008") {
          updnLineArr[i].className = "line8";
        } else if(subway[i].subwayId._text == "1009") {
          updnLineArr[i].className = "line9";
        } else if(subway[i].subwayId._text == "1063") {
          updnLineArr[i].className = "Gyeongui-Jungang_Line";
        } else if(subway[i].subwayId._text == "1065") {
          updnLineArr[i].className = "Airport-Railroad-Express";
        } else if(subway[i].subwayId._text == "1067") {
          updnLineArr[i].className = "Gyeongchun_Line";
        } else if(subway[i].subwayId._text == "1075") {
          updnLineArr[i].className = "Suin-Bundang_Line";
        } else if(subway[i].subwayId._text == "1077") {
          updnLineArr[i].className = "Shinbundang_Line";
        } else if(subway[i].subwayId._text == "1091") {
          updnLineArr[i].className = "Incheon-Airport-Maglev_Line";
        } else if(subway[i].subwayId._text == "1092") {
          updnLineArr[i].className = "Ui-Sinseol_Line";
        } 
        updnLineArr[i].innerHTML = subway[i].updnLine._text;
        RowArr[i].appendChild(updnLineArr[i]);

        // 도착지 방면 (성수행, 강남행)
        trainLineNmArr[i] = document.createElement("td");
        trainLineNmArr[i].className = "trainLine";
        if (subway[i].statnNm._text.includes("행")) {
          var SubwayDirection = subway[i].trainLineNm._text.split(" ");
          
          // 열차 종류 (급행 / ITX) / 막차 표시
          if (subway[i].trainLineNm._text.includes("급행")) {
            trainLineNmArr[i].innerHTML = SubwayDirection[0] + " (급행)";
          } else if (subway[i].trainLineNm._text.includes("막차")) {
            trainLineNmArr[i].innerHTML = SubwayDirection[0] + " (막차)";
          }
          else {
            trainLineNmArr[i].innerHTML = SubwayDirection[0];
          }

          RowArr[i].appendChild(trainLineNmArr[i]);
        } else {
          var pos1 = subway[i].trainLineNm._text.indexOf("행");
          var SubwayDirection = subway[i].trainLineNm._text.substr(0, pos1 + 1);

          // 열차 종류 (급행 / ITX) / 막차 표시
          if (subway[i].trainLineNm._text.includes("급행")) {
            trainLineNmArr[i].innerHTML = SubwayDirection + " (급행)";
          } else if (subway[i].trainLineNm._text.includes("막차")) {
            trainLineNmArr[i].innerHTML = SubwayDirection + " (막차)";
          } 
          else {
            trainLineNmArr[i].innerHTML = SubwayDirection;
          }
          
          RowArr[i].appendChild(trainLineNmArr[i]);
        }

        // 열차 도착 시간 및 현재 위치 표시
        arvlMsgArr[i] = document.createElement("td");
        arvlMsgArr[i].className = "arvlMsg"
        if (subway[i].arvlCd._text == "0") {
          arvlMsgArr[i].innerHTML = "진입";
        } else if (subway[i].arvlCd._text == "1") {
          arvlMsgArr[i].innerHTML = "도착";
        } else if (subway[i].arvlCd._text == "2") {
          arvlMsgArr[i].innerHTML = "출발";
        } else if (subway[i].arvlCd._text == "3") {
          arvlMsgArr[i].innerHTML = "전역 출발";
        } else if (subway[i].arvlCd._text == "4") {
          arvlMsgArr[i].innerHTML = "전역 진입";
        } else if (subway[i].arvlCd._text == "5") {
          arvlMsgArr[i].innerHTML = "전역 도착";
        } else {
          var barvlDt = Math.floor(parseInt(subway[i].barvlDt._text)/60);
          if (barvlDt < 1) {
            arvlMsgArr[i].innerHTML = subway[i].arvlMsg3._text;
          } else {
            arvlMsgArr[i].innerHTML = subway[i].arvlMsg3._text + " (" + barvlDt + "분)";
          }
        }

        RowArr[i].appendChild(arvlMsgArr[i]);
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
