const socket = io(); //En caso de tener un dominio, definirlo como parametro, ejemplo: io('https://bit.ly/hernanreiq');

var user_count = document.getElementById('user_count');

var map = L.map('map-template', {
    center: [18.481232, -69.915466],
    zoom: 13
});

var userIcon = L.icon({
    iconUrl: '/img/user.png',
    iconSize: [30, 35],
    iconAnchor: [20, 30],
    popupAnchor: [-3, -30],
});

var myuserIcon = L.icon({
    iconUrl: '/img/myuser.png',
    iconSize: [30, 35],
    iconAnchor: [20, 30],
    popupAnchor: [-3, -30],
});

const tileURL = 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

L.tileLayer(tileURL).addTo(map);

map.locate({enableHighAccuracy: true});
map.on('locationfound', e => {
    var coords = [e.latlng.lat, e.latlng.lng];
    L.marker(coords, {icon: myuserIcon})
    .bindPopup('You are here!')
    .addTo(map);

    //enviar coordenadas al servidor
    socket.emit('user_coordinates', e.latlng);
});

socket.on('user_connected', (coords) => {
    L.marker([coords.lat, coords.lng], {icon: userIcon})
    .bindPopup('This is an user')
    .addTo(map);
    bootstrapAlerts('A new user is connected', 'alert-success');
});

socket.on('users_online', (countUsers) => {
    user_count.innerText = countUsers;
});

//ENVIAR ALERTAS AL USUARIO
function bootstrapAlerts(message, typeAlert) {
    document.getElementById('container_alerts').innerHTML += `
    <div class="alert ${typeAlert} alert-dismissible fade show" role="alert">
        <strong>${message}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `; 
}