// Obtenemos la funcion de bateria
var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

// Obtenemos los valores
console.log("¿Cargando?: ", battery.charging);
console.log("Nivel de Bateria: ", battery.level); // 0.58
console.log("Tiempo estimado: ", battery.dischargingTime);

//Listener por si cambia la bateria
battery.addEventListener("levelchange", function(e) {
	console.log("Nivel de Bateria: ", battery.level);
}, false);
