// var defaultIcon = makeMarkerIcon('0091ff');

// // Create a "highlighted location" marker color for when the user
// // mouses over the marker.
// var highlightedIcon = makeMarkerIcon('FFFF24');

var homeMarker = new google.maps.Marker({
	map: map,
    icon: highlightedIcon,
	animation: google.maps.Animation.DROP,
});