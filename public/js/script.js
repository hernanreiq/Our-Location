const socket = io(); //En caso de tener un dominio, definirlo como parametro, ejemplo: io('https://bit.ly/hernanreiq');

//COORDENADAS DE DONDE INICIARÁ EL MAPA
var map = L.map('map-template', {
    center: [18.481232, -69.915466],
    zoom: 11
});

//ICONO QUE SE PINTARÁ PARA LOS USUARIOS
var userIcon = L.icon({
    iconUrl: '/img/user.png',
    iconSize: [30, 35],
    iconAnchor: [20, 30],
    popupAnchor: [-3, -30],
});

//ICONO QUE SE PINTARÁ PARA MI
var myuserIcon = L.icon({
    iconUrl: '/img/myuser.png',
    iconSize: [30, 35],
    iconAnchor: [20, 30],
    popupAnchor: [-3, -30],
});

//ESTILO DE MAPAS UTILIZADOS
const tileURL = 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
L.tileLayer(tileURL).addTo(map);

//PINTAR MI UBICACIÓN EN TIEMPO REAL
var myCoords = '';
map.locate({enableHighAccuracy: true});
map.on('locationfound', e => {
    myCoords = [e.latlng.lat, e.latlng.lng];
    L.marker(myCoords, {icon: myuserIcon})
    .bindPopup('You are here!')
    .addTo(map);    
    
    //ENVIAR MIS COORDENADAS A TODOS LOS USUARIOS ACTIVOS
    socket.on('connect', ()=>{
        socket.emit('user_coordinates', {coords: myCoords, userId: socket.id});
    });
});


//PINTAR LA UBICACIÓN DE UN USUARIO CUANDO SE CONECTE
socket.on('user_connected', (data) => {
    L.marker(data.coords, {icon: userIcon})
    .bindPopup('This is an user')
    .addTo(map);
    bootstrapAlerts('A new user is connected', 'alert-success');
    
    // ENVIARLE MI UBICACIÓN AL NUEVO USUARIO
    socket.emit('old_user_coordinates', {coords: myCoords, newUserId: data.userId});
});

//CONTADOR DE USUARIOS ONLINE
var user_count = document.getElementById('user_count');
socket.on('users_online', (countUsers) => {
    user_count.innerText = countUsers;
});

//PINTAR LA UBICACIÓN DE UN USUARIO VIEJO
socket.on('old_user_coords', (data) => {
    L.marker(data, {icon: userIcon})
    .bindPopup('This is an user')
    .addTo(map);
});

//ENVIAR ALERTAS AL USUARIO
var container_alerts = document.getElementById('container_alerts');
function bootstrapAlerts(message, typeAlert) {
    container_alerts.innerHTML += `
    <div class="alert ${typeAlert} alert-dismissible fade show" role="alert">
        <strong>${message}</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `; 
    //ELIMINAR LA ALERTA (SI EXISTE) LUEGO DE 5 SEGUNDOS
    setTimeout(function(){
        if(container_alerts.children[0]){
            container_alerts.removeChild(container_alerts.children[0]);
        }
    }, 5000);
}

