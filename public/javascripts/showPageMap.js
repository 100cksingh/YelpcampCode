mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: [-74.5, 40], // starting position [lng, lat]
zoom: 4 // starting zoom
// projection: 'globe' // display the map as a 3D globe
});