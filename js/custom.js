$(document).ready(function() {
  if (navigator.geolocation) {
    console.log('Soportado');
  } else {
    console.log('Geolocation no disponible');
  }


  $("#callbtn").click(function() {
  if (!navigator.geolocation){
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);
  };

  function error() {

  };


  navigator.geolocation.getCurrentPosition(success, error);

  });
});
