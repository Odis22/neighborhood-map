var views = ['Favorites', '"L" Stops', 'Bus Stops']
var pois = [
		{'title': 'Toro Sushi', 'location': {'lat': 41.928962, 'lng': -87.642691}, 'fsid': '4a2b0f33f964a52093961fe3'},
		{'title': 'Lincoln Park Zoo', 'location': {'lat': 41.921092, 'lng':-87.633991}, 'fsid': '45840a3af964a520903f1fe3'},
		{'title': 'Batter & Berries', 'location': {'lat': 41.9316,'lng': -87.657725}, 'fsid': '4fc123a9e4b05b8503037d8a'},
		{'title': 'Goose Island Brew Pub', 'location': {'lat': 41.91351,'lng': -87.654556}, 'fsid': '40b3de00f964a5201f001fe3'},
		{'title': "Delilah's", 'location': {'lat': 41.93224, 'lng': -87.658136}, 'fsid': '40b28c80f964a52029fc1ee3'},
		{'title': "The Wiener's Circle", 'location': {'lat': 41.930175, 'lng': -87.643779}, 'fsid': '4b21e5c7f964a520434224e3'}
	];

var home = {lat: 41.933021, lng:-87.640399 };
var lp = {lat: 41.921438, lng:-87.651304};
var fsURL = 'https://api.foursquare.com/v2/venues/'
var fsParams = '?client_id=ZZDRRXMKOZYK3JBRIEDMYNO02M31LOHCMIQ2BMAZKRQYAAUU&client_secret=O2XLL30HW1VS4YXVAUF0Z0OJ5YZ3WTEZ3EAWBNRHTW5X2ZEL&v=20170606'

var Marker = function(data, model){
	var self = this;

	this.position = data.location;
	this.title = data.title;

	this.fsData = {};
	this.marker = {};

	var fsRequestTimeout = setTimeout(function(){
		self.error = "Failed to get FourSquare resources";
	}, 8000);

	// Create a marker per location
	$.ajax({
		url: fsURL + data.fsid + fsParams,
		dataType: 'json',
		type: 'GET',
		success: function(data) {
			// console.log(data.response.venue.name);
			// console.log(data.response.venue.bestPhoto.prefix + 'width300' + data.response.venue.bestPhoto.suffix);
			self.fsData = data.response.venue
			self.marker = new google.maps.Marker({
				map: model.map,
				position: self.position,
				title: self.title,
				icon: model.defaultIcon,
				animation: google.maps.Animation.DROP,
				id: self.fsData.id,
				fsData: self.fsData
			});

			model.bounds.extend(self.position);
			// Create an onclick event to open an infowindow at each marker.
			self.marker.addListener('click', function() {
				self.populateInfoWindow();
			});
			// bounds.extend(poiMarkers[i].position);

			self.marker.addListener('mouseover', function() {
				this.setIcon(model.highlightedIcon);
			});
			self.marker.addListener('mouseout', function() {
				this.setIcon(model.defaultIcon);
			});
			
			clearTimeout(fsRequestTimeout);
			model.map.fitBounds(model.bounds);
		}
	});

	this.populateInfoWindow = function(){
		var infowindow = model.largeInfowindow
		console.log(self.marker);
		var content = '<div id="infoContent"><h3><a href="' + self.marker.fsData.canonicalUrl + '" target="_blank" >' + self.marker.title + '</a></h3> <span>Rating: ' + self.marker.fsData.rating + '/10</span></br><img width="300" src="' + self.marker.fsData.bestPhoto.prefix + 'width300' + self.marker.fsData.bestPhoto.suffix + '" /></div>'
		infowindow.setContent(content);
		infowindow.marker = self.marker;
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
			marker.content = null;
		});
		infowindow.open(map, self.marker);
	};

	this.hideMe = function(){
		self.marker.setMap(null);
	};

	this.showMe = function(){
		self.marker.setMap('map');
	};
};

function ViewModel(data) {
	var self = this;

	//Observables
	this.views = ko.observableArray(views);
	this.selectedView = ko.observable(this.views()[0]);
	this.filterString = ko.observable();

	//Basic Maps Objects
	this.bounds = new google.maps.LatLngBounds();
	this.largeInfowindow = new google.maps.InfoWindow(); 
	this.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: lp
	});


	//MARKER ICONS
	this.defaultIcon = makeMarkerIcon('2196F3');
	this.homeIcon = makeMarkerIcon('green');
	this.highlightedIcon = makeMarkerIcon('FF4081');


	//SET UP HOME MARKER
	this.homeMarker = new google.maps.Marker({
		position:home,
		map: this.map,
		animation: google.maps.Animation.DROP,
	});
	this.homeMarker.addListener('click', function() {
		var infowindow = self.largeInfowindow;
		var content = '<div id="infoContent"><h3>Home</h3></div>'
		infowindow.setContent(content);
		infowindow.marker = self.homeMarker;
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
			marker.content = null;
		});
		infowindow.open(map, self.homeMarker);
	});
	this.bounds.extend(self.homeMarker.position);

	function makeMarkerIcon(markerColor) {
		var markerImage = new google.maps.MarkerImage(
			'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
			'|40|_|%E2%80%A2',
			new google.maps.Size(25, 42),
			new google.maps.Point(0, 0),
			new google.maps.Point(10, 34),
			new google.maps.Size(25,42));
		return markerImage;
	}


	this.poiList = [];

	pois.forEach(function(poi){
		var mk = new Marker(poi, self);
		self.poiList.push(mk);

	});



	// Extend the boundaries of the map for each marker and display the marker
	pois.forEach(function(poi){
		
	});

	// for (var i = 0; i < this.poiList.length; i++) {
	// 	bounds.extend(poi.marker.position);
	// }
	// this.map.fitBounds(this.bounds);


	self.listClicked = function(clicked){
		self.poiList.forEach(function(poi){
			if (poi.marker.id == clicked.fsid){
				poi.populateInfoWindow();
			}
		})
	};

	self.viewChanged = function(view, evt){
		self.selectedView(self.views()[evt.target.id]);
	};

	self.hideAll = function(){
		self.poiList.forEach(function(poi){
			poi.hideMe();
		})
	};

	self.filter = function(){
		console.log(self.filterString());
		self.poiList.forEach(function(poi){
			
		})
	};

};

function initMap() {
	vm = new ViewModel();
	ko.applyBindings(vm);
}