// Obtenemos la funcion de bateria
var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

var chargingStateEl = document.getElementById('chargingState');
var chargingTimeEl = document.getElementById('chargingTime');
var dichargeTimeEl = document.getElementById('dischargeTime');
var levelEl = document.getElementById('level');

function updateBatteryUI(battery) {
  levelEl.textContent = (battery.level * 100) + '%';
  dichargeTimeEl.textContent = convertTime(battery.dischargingTime);
  console.log(convertTime(battery.dischargingTime));
  if (battery.charging === true) {
    chargingStateEl.textContent = 'Si';
  } else if (battery.charging === false) {
    chargingStateEl.textContent = 'No';
  }
}

function monitorBattery(battery) {
  updateBatteryUI(battery);
  battery.addEventListener('levelchange',
    updateBatteryUI.bind(null, battery));
  battery.addEventListener('chargingchange',
    updateBatteryUI.bind(null, battery));
  battery.addEventListener('dischargingtimechange',
    updateBatteryUI.bind(null, battery));
  battery.addEventListener('chargingtimechange',
    updateBatteryUI.bind(null, battery));
}

if ('getBattery' in navigator) {
  navigator.getBattery().then(monitorBattery);
} else {
  alert("Tu navegador no soporta lectura de bateria")
}

function convertTime(sec) {
  var hours = Math.floor(sec / 3600);
  (hours >= 1) ? sec = sec - (hours * 3600): hours = '00';
  var min = Math.floor(sec / 60);
  (min >= 1) ? sec = sec - (min * 60): min = '00';
  (sec < 1) ? sec = '00': void 0;

  (min.toString().length == 1) ? min = '0' + min: void 0;
  (sec.toString().length == 1) ? sec = '0' + sec: void 0;

  return hours + ':' + min + ':' + sec;
}
