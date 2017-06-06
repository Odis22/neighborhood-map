function ViewModel() {
	var self = this;
	//TO-DO - Build out Model
	self.testing = ko.observableArray(["Test 1", "Test 1-2","1-2-3"]);
	self.pois = [
		{title: 'Toro Sushi', location: {lat: 41.928962, lng: -87.642691}},
		{title: 'Lincoln Park Zoo', location: {lat: 41.921092, lng:-87.633991}},
		{title: 'Batter & Berries', location: {lat: 41.9316,lng: -87.657725}},
		{title: 'Goose Island Brew Pub', location: {lat: 41.91351,lng: -87.654556}},
		{title: "Delilah's", location: {lat: 41.93224, lng: -87.658136}},
		{title: 'The Weiner Circle', location: {lat: 41.930175, lng: -87.643779}}
	];
	self.showWindow = function(clicked){
		console.log(clicked);
	}

};

vm = new ViewModel();

ko.applyBindings(vm);

function initMap() {
	var poiMarkers = [];
	var lp = {lat: 41.921438, lng:-87.651304};
	var home = {lat: 41.933021, lng:-87.640399 };

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: lp
	});
	var defaultIcon = makeMarkerIcon('0091ff');

	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	var highlightedIcon = makeMarkerIcon('FFFF24');

	var homeMarker = new google.maps.Marker({
		position:home,
		map: map,
			icon: highlightedIcon,
		animation: google.maps.Animation.DROP,
	});

	for (var i = 0; i < vm.pois.length; i++) {
		// Get the position from the location array.
		var position = vm.pois[i].location;
		var title = vm.pois[i].title;
		// Create a marker per location, and put into poiMarkers array.
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});
		// Push the marker to our array of poiMarkers.
		poiMarkers.push(marker);
		// Create an onclick event to open an infowindow at each marker.
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
		// bounds.extend(poiMarkers[i].position);
	}
		// Extend the boundaries of the map for each marker
	// map.fitBounds(bounds);

	function makeMarkerIcon(markerColor) {
			var markerImage = new google.maps.MarkerImage(
				'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
				'|40|_|%E2%80%A2',
				new google.maps.Size(21, 34),
				new google.maps.Point(0, 0),
				new google.maps.Point(10, 34),
				new google.maps.Size(21,34));
			return markerImage;
		}
}

