import { AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { IonCardSubtitle } from '@ionic/angular';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
 
}) 

export class HomePage implements OnInit, AfterContentInit {
  map;
  @ViewChild('mapElement') mapElement;
 
  constructor(public router:Router , 
              public navCtrl:NavController) {
    
  }   

  enableProdMode():void{}

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: [-1.11, 37.98], // starting position [lng, lat]
      zoom: 8, // starting zoom
    });

    //Rich Style
    map.on('load', function() {
      map.resize();
      map.setLayoutProperty('country-label', 'text-field', ['format',
      ['get', 'name_en'], { 'font-scale': 1.2 },
        '\n', {},
        ['get', 'name'], {
        'font-scale': 0.8,
        'text-font': ['literal', [ 'DIN Offc Pro Italic', 'Arial Unicode MS Regular' ]]
        }
      ]);    
    });
    map.addControl(new MapboxDirections({
      accessToken: mapboxgl.accessToken
    }), 'top-left');

    // menu and input layerss
    var layerList = document.getElementsByClassName('menu');
    var inputs = document.getElementsByTagName('img');
    
    function switchLayer(layer) {
        var layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
    }
      
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].onclick = switchLayer;
    }

    //Locate the User 
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        showUserLocation:true
      },
        trackUserLocation: true
    }));
    
    // Add zoom and rotation controls to the map.
      map.addControl(new mapboxgl.NavigationControl());
      map.addControl(new mapboxgl.FullscreenControl());
 
    
    var coordinatesGeocoder = function (query) {
    // match anything which looks like a decimal degrees coordinate pair
        var matches = query.match(/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i);
        if (!matches) {
          return null;
        }
         
    function coordinateFeature(lng, lat) {
      return {
        center: [lng, lat],
        geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        place_name: 'Lat: ' + lat + ' Lng: ' + lng, // eslint-disable-line camelcase
        place_type: ['coordinate'], // eslint-disable-line camelcase
        properties: {},
        type: 'Feature'
      };
    }
         
    var coord1 = Number(matches[1]);
    var coord2 = Number(matches[2]);
    var geocodes = [];    
        if (coord1 < -90 || coord1 > 90) {
        // must be lng, lat
          geocodes.push(coordinateFeature(coord1, coord2));
        }
         
        if (coord2 < -90 || coord2 > 90) {
        // must be lat, lng
          geocodes.push(coordinateFeature(coord2, coord1));
        }
         
        if (geocodes.length === 0) {
        // else could be either lng, lat or lat, lng
          geocodes.push(coordinateFeature(coord1, coord2));
          geocodes.push(coordinateFeature(coord2, coord1));
        }
         
            return geocodes;
    };

    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom:6,
          marker: {
            color: 'orange'
          },
        mapboxgl: mapboxgl
    });
  
      //SEARCHBAR
        document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
        
      

        
  }

}