var views = ['Favorites', '"L" Stops', 'Bus Stops'];
var favorites = [
		{'title': 'Toro Sushi', 'location': {'lat': 41.928962, 'lng': -87.642691}, 'fs': true, 'fsid': '4a2b0f33f964a52093961fe3', 'visible': true},
		{'title': 'Lincoln Park Zoo', 'location': {'lat': 41.921092, 'lng':-87.633991}, 'fs': true, 'fsid': '45840a3af964a520903f1fe3', 'visible': true},
		{'title': 'Batter & Berries', 'location': {'lat': 41.9316,'lng': -87.657725}, 'fs': true, 'fsid': '4fc123a9e4b05b8503037d8a', 'visible': true},
		{'title': 'Goose Island Brew Pub', 'location': {'lat': 41.91351,'lng': -87.654556}, 'fs': true, 'fsid': '40b3de00f964a5201f001fe3', 'visible': true},
		{'title': "Delilah's", 'location': {'lat': 41.93224, 'lng': -87.658136}, 'fs': true, 'fsid': '40b28c80f964a52029fc1ee3', 'visible': true},
		{'title': "Dunlay's on Clark", 'location': {'lat': 41.929698, 'lng': -87.643228}, 'fs': true, 'fsid': '49c7d161f964a520c5571fe3', 'visible': true},
		{'title': "Homeslice", 'location': {'lat': 41.921928, 'lng': -87.652522}, 'fs': true, 'fsid': '50fc446ce4b06b7fe702536e', 'visible': true},
		{'title': "The Wiener's Circle", 'location': {'lat': 41.930175, 'lng': -87.643779}, 'fs': true, 'fsid': '4b21e5c7f964a520434224e3', 'visible': true}
	];
var poiResults = [];

var home = {lat: 41.933021, lng:-87.640399 };
var lp = {lat: 41.921438, lng:-87.651304};
var fsURL = 'https://api.foursquare.com/v2/venues/';
var fsParams = '?client_id=ZZDRRXMKOZYK3JBRIEDMYNO02M31LOHCMIQ2BMAZKRQYAAUU&client_secret=O2XLL30HW1VS4YXVAUF0Z0OJ5YZ3WTEZ3EAWBNRHTW5X2ZEL&v=20170606';

var Marker = function(data, model){
	var self = this;

	this.position = ko.observable(data.location);
	this.title = ko.observable(data.title);
	this.fs = ko.observable(data.fs);
	this.visible = ko.observable(true);
	
	// this.fsData = {};
	this.marker = {};

	if (!this.fs())
	{
		self.googData = data.place;
		self.marker = new google.maps.Marker({
			map: model.map,
			position: self.position(),
			title: self.title(),
			icon: {
				url: self.googData.icon,
				size: new google.maps.Size(35, 35),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(15, 34),
				scaledSize: new google.maps.Size(25, 25)
			},
			animation: google.maps.Animation.DROP,
			id: self.googData.place_id,
			googData: self.fsData
		});

		//EXTEND BOUNDS AND RE-FIT THE MAP TO THEM
		model.bounds.extend(self.position());
		model.map.fitBounds(model.bounds);

		// ON CLICK LISTENER TO OPEN INFOWINDOW
		self.marker.addListener('click', function() {
			self.populateInfoWindow();
		});

		//MOUSEOVER / MOUSEOUT LISTENERS TO CHANGE COLOR
		self.marker.addListener('mouseover', function() {
			// this.setIcon(model.highlightedIcon);
		});
		self.marker.addListener('mouseout', function() {
			// this.setIcon(model.defaultIcon);
		});
	}
	else{
		var fsRequestTimeout = setTimeout(function(){
			self.error = "Failed to get FourSquare resources";
		}, 8000);

		// Create a marker per location
		$.ajax({
			url: fsURL + data.fsid + fsParams,
			dataType: 'json',
			type: 'GET',
			success: function(data) {
				
				//ON API SUCCESS WRITE DATA TO AND CRATE MARKER ON DATA OBJECT
				//THEN ADD LISTENERS TO THE MARKER FOR MAP INTERACTIVITY

				self.fsData = data.response.venue;
				self.marker = new google.maps.Marker({
					map: model.map,
					position: self.position(),
					title: self.title(),
					icon: model.defaultIcon,
					animation: google.maps.Animation.DROP,
					id: self.fsData.id,
					fsData: self.fsData,
					fs: self.fs
				});

				//EXTEND BOUNDS AND RE-FIT THE MAP TO THEM
				model.bounds.extend(self.position());
				model.map.fitBounds(model.bounds);

				// ON CLICK LISTENER TO OPEN INFOWINDOW
				self.marker.addListener('click', function() {
					self.marker.setAnimation(google.maps.Animation.BOUNCE);
					self.populateInfoWindow(this.fs());
				});

				//MOUSEOVER / MOUSEOUT LISTENERS TO CHANGE COLOR
				self.marker.addListener('mouseover', function() {
					this.setIcon(model.highlightedIcon);
				});
				self.marker.addListener('mouseout', function() {
					this.setIcon(model.defaultIcon);
				});
				
				//CANCEL TIMEOUT FOR API ERROR
				clearTimeout(fsRequestTimeout);
			},
			error: function(){
				alert("Foursquare API Call Failed - Sorry for the Inconvenience");
			}
		});
	}

	self.populateInfoWindow = function(fs){
		if(!fs){
			self.populatePlacesInfoWindow();
		}else{
			self.populateFSInfoWindow();
		}
	};
		

	self.populateFSInfoWindow = function(){
		var infowindow = model.largeInfowindow;
		var content = '<div id="infoContent"><h3><a href="' + self.marker.fsData.canonicalUrl + '" target="_blank" >' + self.marker.title + '</a></h3> <span>Rating: ' + self.marker.fsData.rating + '/10</span></br><img width="300" src="' + self.marker.fsData.bestPhoto.prefix + 'width300' + self.marker.fsData.bestPhoto.suffix + '" /></div><h6>Data provided by Foursquare.</h6>';
		infowindow.setContent(content);
		infowindow.marker = self.marker;
		infowindow.addListener('closeclick', function() {
			infowindow.marker.setAnimation(google.maps.Animation.DROP);
			infowindow.marker = null;
			self.marker.content = null;
		});
		infowindow.open(map, self.marker);
	};	

	self.populatePlacesInfoWindow = function(){
		var infowindow = model.largeInfowindow;
		
		var content = '<div id="infoContent"><h3>' + self.marker.title + '</h3></div>';
		infowindow.setContent(content);
		infowindow.marker = self.marker;
		infowindow.addListener('closeclick', function() {
			infowindow.marker.setAnimation(google.maps.Animation.DROP);
			infowindow.marker = null;
			self.marker.content = null;
		});
		infowindow.open(map, self.marker);
	};

	this.hideMe = function(){
		self.marker.setMap(null);
	};

	this.showMe = function(){
		self.marker.setMap(model.map);
	};
};

function ViewModel(data) {
	var self = this;

	//Observables
	this.views = ko.observableArray(views);
	this.selectedView = ko.observable(this.views()[0]);
	this.filterString = ko.observable();
	this.poiList = ko.observableArray();

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
		var content = '<div id="infoContent"><h3>Home</h3></div>';
		infowindow.setContent(content);
		infowindow.marker = self.homeMarker;
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
			marker.content = null;
		});
		infowindow.open(map, self.homeMarker);
	});
	this.bounds.extend(self.homeMarker.position);


	//UTILITY TO MAKE COLORED MARKERS
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


	//TAKES INPUT ARRAY AND CREATES A NEW MARKER OBJECT FOR EACH, ADDING THEM TO THE poiList OBSERVABLE ARRAY
	this.setPOIs = function(list){
		list.forEach(function(poi){
			var mk = new Marker(poi, self);
			self.poiList.push(mk);
		});
	};

	//OPENS 
	this.listClicked = function(clicked){
		if (clicked.fs()){
			self.poiList().forEach(function(poi){
				if (poi.marker.id == clicked.fsData.id){
					poi.populateInfoWindow(poi.fs());
				}
			});
		}else{
			self.poiList().forEach(function(poi){
				if (poi.marker.id == clicked.marker.id){
					poi.populateInfoWindow(poi.fs());
				}
			});
		}
	};

	this.viewChanged = function(view, evt){
		self.selectedView(self.views()[evt.target.id]);
	};

	this.destroyMarkers = function(){
		self.poiList().forEach(function(poi){
			poi.hideMe();
		});
		self.poiList.removeAll();
	};
	this.filter = function(){
		filter = self.filterString();
		if (filter || filter === ''){
			self.poiList().forEach(function(poi){
				if(poi.title().toUpperCase().indexOf(filter.toUpperCase()) > -1){
					poi.visible(true);
					poi.showMe();
				}else{
					poi.visible(false);
					poi.hideMe();
				}
			});
		}
	};

	this.filterWorker = ko.computed(function () {
		var trigger = self.filterString();
		self.filter();
	}, this);

	this.showPlaces = ko.computed(function () {
		var which = self.selectedView();
		var request, service;
		if (self.selectedView() == 'Bus Stops'){
			request = {
				bounds: self.map.getBounds(),
				type: ['bus_station']
			};
			service = new google.maps.places.PlacesService(this.map);
			service.nearbySearch(request, self.callback);
		}else if(self.selectedView() == '"L" Stops'){
			request = {
				bounds: self.map.getBounds(),
				type: ['subway_station']
			};
			service = new google.maps.places.PlacesService(this.map);
			service.nearbySearch(request, self.callback);
		}else if (self.selectedView() == 'Favorites'){
			self.destroyMarkers();
			self.setPOIs(favorites);
		}
	}, this);


	this.callback = function(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			poiResults = [];
			results.forEach(function(poi){
				var mk  = {'title': poi.name, 'location': poi.geometry.location, 'visible': true, place: poi};
				poiResults.push(mk);
			});
			self.destroyMarkers();
			self.setPOIs(poiResults);
		}
		else if(status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS){
			window.alert("Places Service found no results");
		}
		else{
			window.alert("Places Service failed to respond");
		}
	};

}

function initMap() {
	vm = new ViewModel();
	ko.applyBindings(vm);
}