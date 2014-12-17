//
// Copyright 2014, Evothings AB
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
//

var app = {}
app.TIME_BETWEEN_REQUESTS = 5000

app.initializeMap = function initialize() 
{

	var mapOptions = {
		center: { lat: 59.3383, lng: 18.0621},
    	zoom: 13,
    	
    	draggable: true,
    	panControl: false,
    	mapTypeControl: false,
    	streetViewControl: false,
    	zoomControl:false,	
	}
	
	app.map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions)
}

google.maps.event.addDomListener(window, 'load', app.initializeMap);

app.connect = function() 
{
	app.IPAdress = $('#IPAdress').val()

	$('#startView').hide()
	
	$('#connectingStatus').text('Connecting to ' + app.IPAdress)
	$('#connectingView').show()

	console.log('Trying to connect to ' + app.IPAdress)

	app.fetchTimer = setInterval(function() { app.fetchData(); }, app.TIME_BETWEEN_REQUESTS);
}

app.fetchData = function()
{	
	console.log('Trying to fetch data...')

	$.getJSON('http://' + app.IPAdress, app.dataReceived)	
}

app.dataReceived = function(data, textStatus, xhr)
{
	$('#connectingView').hide()
	$('#mapView').show()
	google.maps.event.trigger(app.map, "resize")


	var longitude = parseFloat(data['long'])
	var longitudeDecimalPart = longitude % 1
	longitude = longitude - longitudeDecimalPart + (longitudeDecimalPart * 100 / 60)

	var latitude = parseFloat(data['lat']) 
	var latitudeDecimalPart = latitude % 1
	latitude = latitude - latitudeDecimalPart + (latitudeDecimalPart * 100 / 60)

	var positionString = 'Latitude: ' + latitude + ', Longitude: ' + longitude
	
	console.log('Received data - ' + positionString)
	
	if(app.marker) {
		app.marker.setMap(null)
	}

	var markerPosition = new google.maps.LatLng(latitude, longitude)

	app.marker = new google.maps.Marker({
    	position: markerPosition,
    	title: positionString
	})

	app.marker.setMap(app.map)

	app.map.panTo(app.marker.getPosition())
}

app.disconnect = function()
{
	clearInterval(app.fetchTimer)

	$('#mapView').hide()
	$('#startView').show()
}
