# Module: SeoulSubway
The MMM-SeoulSubway is a module designed to display the real-time subway arrival information of Seoul, South Korea.

#### Example:

##### 1) statnNm: "사당", direction: "방배"

![example1](https://user-images.githubusercontent.com/97887583/163681408-4ddb23ca-02ed-4535-8052-0a0e94e7bcd8.PNG)

##### 2) statnNm: "사당", direction: "남태령"

![example2](https://user-images.githubusercontent.com/97887583/163681452-68d09c17-929d-46c3-836e-7a75f117a969.PNG)


##### 3) statnNm: "사당", direction: ""
![example3](https://user-images.githubusercontent.com/97887583/163681455-a197c5dd-3e0a-44d1-89eb-b72c90fb1e4c.PNG)

## Using the module
Git clone this repository into modules directory of MagicMirror, change directory and run npm install. 
```bash
git clone https://github.com/danbi7184/MMM-SeoulSubway.git
cd MMM-SeoulSubway
npm install
```

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
{
		module: "MMM-SeoulSubway",
		position: "top_left",
		config: {
			sample: "http://swopenapi.seoul.go.kr/api/subway",
			key: "", // Your API KEY
			startIndex: 0,
			endIndex: 15,
			statnNm: "", // Input the Station Name You Want to See
			header: "역 지하철 정보", // Input the Station Name You Want to See
			direction: "", // Input the Station Name You Want to Go (방면)
			updateInterval: 60000

		}
},
````

## Configuraion options

The following properties can be configured:

<table width="100%">
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>sample</code></td>
			<td>Seoul Subway API's Base URL
			</td>
		</tr>
		<tr>
			<td><code>key</code></td>
			<td>To Use this Module, You have to Get API Key from this URL.
				<br><a href="https://data.seoul.go.kr/dataList/OA-12764/F/1/datasetView.do">
				https://data.seoul.go.kr/dataList/OA-12764/F/1/datasetView.do</a>
			</td>
		</tr>
		<tr>
			<td><code>startIndex</code></td>
			<td>Start Number of Paging
			</td>
		</tr>
		<tr>
			<td><code>endIndex</code></td>
			<td>End Number of Paging
			</td>
		</tr>
		<tr>
			<td><code>statnNm</code></td>
			<td>the Station Name You Want to See
			</td>
		</tr>
		<tr>
			<td><code>header</code></td>
			<td>Title Information
			</td>
		</tr>
		<tr>
			<td><code>direction</code></td>
			<td>the Station Name You Want to Go (Direction/방면)
				<br>This value is <b>OPTIONAL</b>
			</td>
		</tr>
		<tr>
			<td><code>updateInterval</code></td>
			<td>Update Interval
				<br>default: 60000 / 1 minute
			</td>
		</tr>
	</tbody>
</table>
