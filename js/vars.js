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