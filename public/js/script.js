const socket = io(); //En caso de tener un dominio, definirlo como parametro, ejemplo: io('https://bit.ly/hernanreiq');

var map = L.map('map-template', {
    center: [18.481232, -69.915466],
    zoom: 13
});

const tileURL = 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

L.tileLayer(tileURL).addTo(map);

map.locate({enableHighAccuracy: true});
map.on('locationfound', e => {
    var coords = [e.latlng.lat, e.latlng.lng];
    L.marker(coords)
    .bindPopup('You are here!')
    .addTo(map);

    //enviar coordenadas al servidor
    socket.emit('user_coordinates', e.latlng);
});

socket.on('user_connected', (coords) => {
    L.marker([coords.lat, coords.lng])
    .bindPopup('This is an user')
    .addTo(map);
});