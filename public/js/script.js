const socket = io(); //En caso de tener un dominio, definirlo como parametro, ejemplo: io('https://bit.ly/hernanreiq');

var map = L.map('map-template', {
    center: [51.505, -0.09],
    zoom: 13
});

L.tileLayer('https://a.tile.openstreetmap.de/{z}/{x}/{y}.png').addTo(map)