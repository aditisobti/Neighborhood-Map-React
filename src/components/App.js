import React, { Component } from 'react';
import NearByLocations from './NearByLocations';
import constants from '../Constants';
import * as FourSquareAPI from './../dataprovider/FourSquareProvider';

const locations = constants.myLocations;
/**
 * Main State full component for the application.
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myLocations: constants.myLocations,
            currentInfoWindow: null,
            previousMarker: null
        };

        // This is hold the single instance of the map object.
        this.mapInstance = null;

        // retain object instance when used in the function (borrow methods)
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        // Connect the initMap() function within this class to the global window object.
        window.mapCallback = this.initMap;
        // Async load.
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=' + constants.googleMapKey + '&callback=mapCallback')
    }

    /**
     * Initialize the map instance once the google map script is loaded to the page.
     */
    initMap() {
        var that = this;

        var mapElement = document.getElementById('mymap');
        mapElement.style.height = window.innerHeight + "px";
        that.mapInstance = new window.google.maps.Map(mapElement, {
            center: {
                lat: 47.790007,
                lng: -122.2155961
            },
            zoom: 15,
            mapTypeControl: false
        });

        var singleInfoWindow = new window.google.maps.InfoWindow({});
        window.google.maps.event.addListener(singleInfoWindow, 'closeclick', function () {
            that.closeInfoWindow();
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = that.mapInstance.getCenter();
            window.google.maps.event.trigger(that.mapInstance, "resize");
            that.mapInstance.setCenter(center);
        });

        window.google.maps.event.addListener(that.mapInstance, 'click', function () {
            that.closeInfoWindow();
        });

        var myLocationsData = [];
        locations.forEach(function (location) {
            var longname = location.name + ' - ' + location.type;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: that.mapInstance
            });

            marker.addListener('click', function () {
                that.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            myLocationsData.push(location);
        });

        this.setState({
            currentInfoWindow: singleInfoWindow,
            myLocations: myLocationsData
        });
    }

    /**
     * Open the infowindow for the marker on the map.
     * @param {object} location marker
     */
    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.currentInfoWindow.open(this.mapInstance, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            previousMarker: marker
        });
        this.state.currentInfoWindow.setContent('I am getting data...');
        this.mapInstance.setCenter(marker.getPosition());
        this.mapInstance.panBy(0, -200);
        this.getMarkerDetails(marker);
    }

    /**
     * This will fetch the location data from the foursquare api and display in info window.
     * @param {object} location marker
     */
    getMarkerDetails(marker) {
        var that = this;
        FourSquareAPI.getFourSquareDetails(marker.getPosition().lat(), marker.getPosition().lng())
            .then(response => {
                // Evaluate the the response and create the popup content.
                response.json().then(function (data) {
                    var locationData = data.response.venues[0];
                    var category = '<div id="content"><h3 id="secondHeading" class="secondHeading">Category: ' + locationData.categories[0].shortName + '</h3><br>';
                    var verified = '<div id="bodyContent"><b>Verified Location: </b>' + (locationData.verified ? 'Yes' : 'No') + '<br>';                
                    var postalCode = '<b>Postal code: </b>' + locationData.location.postalCode + '<br>'
                    var readMore = '<a href="https://foursquare.com/v/' + locationData.id + '" target="_blank">Read More on Foursquare site</a></div></div>'
                    that.state.currentInfoWindow.setContent(category + verified + postalCode + readMore);
                });

            })
            .catch(function () {
                that.state.currentInfoWindow.setContent("<b>Error in loading data...</b>");
            });
    }

    /**
     * Close the infowindow for the marker
     * @param {object} location marker
     */
    closeInfoWindow() {
        if (this.state.previousMarker) {
            this.state.previousMarker.setAnimation(null);
        }
        this.setState({
            previousMarker: null
        });
        this.state.currentInfoWindow.close();
    }

    /**
     * Render function of App
     */
    render() {
        return (
            <div>
                <NearByLocations key="100" allMyLocations={this.state.myLocations} openInfoWindow={this.openInfoWindow}
                    closeInfoWindow={this.closeInfoWindow} />
                <div id="mymap" />
            </div>
        );
    }
}

export default App;

/**
 * Load the google maps Asynchronously
 * @param {url} url of the google maps script
 */
function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}