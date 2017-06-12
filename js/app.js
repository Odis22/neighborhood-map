var pois = [
		{title: 'Toro Sushi', location: {lat: 41.928962, lng: -87.642691}, fsid: '4a2b0f33f964a52093961fe3'},
		{title: 'Lincoln Park Zoo', location: {lat: 41.921092, lng:-87.633991}, fsid: '45840a3af964a520903f1fe3'},
		{title: 'Batter & Berries', location: {lat: 41.9316,lng: -87.657725}, fsid: '4fc123a9e4b05b8503037d8a'},
		{title: 'Goose Island Brew Pub', location: {lat: 41.91351,lng: -87.654556}, fsid: '40b3de00f964a5201f001fe3'},
		{title: "Delilah's", location: {lat: 41.93224, lng: -87.658136}, fsid: '40b28c80f964a52029fc1ee3'},
		{title: "The Wiener's Circle", location: {lat: 41.930175, lng: -87.643779}, fsid: '4b21e5c7f964a520434224e3'}
	];

var home = {lat: 41.933021, lng:-87.640399 };
var lp = {lat: 41.921438, lng:-87.651304};
var fsURL = 'https://api.foursquare.com/v2/venues/'
var fsParams = '?client_id=ZZDRRXMKOZYK3JBRIEDMYNO02M31LOHCMIQ2BMAZKRQYAAUU&client_secret=O2XLL30HW1VS4YXVAUF0Z0OJ5YZ3WTEZ3EAWBNRHTW5X2ZEL&v=20170606'

var Marker = function(data, model){
	self = this;
	var fsRequestTimeout = setTimeout(function(){
        self.error = "Failed to get FourSquare resources";
    }, 8000);

	$.ajax({
		url: fsURL + data.fsid + fsParams,
		dataType: 'json',
		type: 'GET',
		success: function(data) {
			console.log(data);
			console.log(data.response.venue.name);
			console.log(data.response.venue.bestPhoto.prefix + 'width300' + data.response.venue.bestPhoto.suffix);
			self.photoURL = data.response.venue.bestPhoto.prefix + 'width300' + data.response.venue.bestPhoto.suffix
			self.fsData = data.response.venue
			clearTimeout(fsRequestTimeout);
		}
	});

	var position = data.location;
	var title = data.title;

	// Create a marker per location
	this.marker = new google.maps.Marker({
		map: model.map,
		position: position,
		title: title,
		icon: model.defaultIcon,
		animation: google.maps.Animation.DROP,
		id: data.fsid
	});
	// Create an onclick event to open an infowindow at each marker.
	this.marker.addListener('click', function() {
		self.populateInfoWindow(this, model.largeInfowindow);
	});
	// bounds.extend(poiMarkers[i].position);

	this.marker.addListener('mouseover', function() {
		this.setIcon(model.highlightedIcon);
	});
	this.marker.addListener('mouseout', function() {
		this.setIcon(model.defaultIcon);
	});

	this.populateInfoWindow = function(marker, infowindow){
		console.log(marker);
		console.log(infowindow);
		var content = '<div id="content"><h3>' + marker.title + '</h3><img width="300" src="' + self.photoURL + '" /></div>'
		infowindow.setContent(content);
		console.log(content);
		infowindow.marker = marker;
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		});
		infowindow.open(map, marker);
	}
};

function ViewModel(data) {
	var self = this;

	this.largeInfowindow = new google.maps.InfoWindow();
	// var snazzyInfoWindow = new SnazzyInfoWindow(); 
	this.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: lp
	});
	this.defaultIcon = makeMarkerIcon('0091ff');
	this.homeIcon = makeMarkerIcon('green');
	this.highlightedIcon = makeMarkerIcon('FFFF24');

	this.homeMarker = new google.maps.Marker({
		position:home,
		map: this.map,
		animation: google.maps.Animation.DROP,
	});

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
	var data = {};
	data.map = this.map;
	data.defaultIcon = this.defaultIcon;
	data.highlightedIcon = this.highlightedIcon;
	data.largeInfowindow = this.largeInfowindow;


	this.poiList = [];

	pois.forEach(function(poi){
		self.poiList.push(new Marker(poi, self).marker);
	});

	self.showWindow = function(clicked){
		console.log(clicked);
	}

};

function initMap() {

	vm = new ViewModel();
	ko.applyBindings(vm);
	// 'https://api.foursquare.com/v2/venues/40a55d80f964a52020f31ee3?client_id=ZZDRRXMKOZYK3JBRIEDMYNO02M31LOHCMIQ2BMAZKRQYAAUU&client_secret=O2XLL30HW1VS4YXVAUF0Z0OJ5YZ3WTEZ3EAWBNRHTW5X2ZEL&v=20170606'
}

