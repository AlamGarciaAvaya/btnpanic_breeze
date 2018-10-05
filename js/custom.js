$(document).ready(function() {

  console.olog = function(e) {};
  console.log = function(message) {
    console.olog(message);
    $('#logger').append('<p>' + message + '</p>');
  };
 console.error = console.debug = console.info =  console.log
 var tel_final = localStorage.getItem('tel_v');
  var endpoint = localStorage.getItem('endpoint_v');
  var debugmode = localStorage.getItem('debug_v');
  var agente = localStorage.getItem('agente_v');

if (debugmode == null || debugmode == 0) {
console.log("Debug Logger Desactivado");
$("#output").hide();
} else {
  console.log("Debug Logger Activado");
}

  if (tel_final === null ) {
    $('#modal-informacion').modal({
                        backdrop: 'static',
                        keyboard: true,
                        show: true
                });
    $("#mensaje-modal").text("Necesitas configurar esta aplicación para poder usarla, enseguida se abrirá la ventana de ajustes");
    setTimeout(function() {
      $('#modal-informacion').modal('hide');
      $('#modal-ajustes').modal({
                          backdrop: 'static',
                          keyboard: true,
                          show: true
                  });
      $('input#endpoint').val("https://breeze2-213.collaboratory.avaya.com/services/EventingConnector/events");
    }, 3200);
  } else {
    $("input#telefono").value = tel_final
    $("input#endpoint").val(endpoint);
    $("select#debugmode").val(debugmode).change();
    $("input#agente").val(agente);

  }

  $("#limpiar-btn").click(function() {
    $('#modal-ajustes').modal('hide');
    localStorage.clear();
    $('#modal-informacion').modal({
                        backdrop: 'static',
                        keyboard: true,
                        show: true
                });
    $("#mensaje-modal").text("Se han limpiado tus Ajustes.\nEsta página se actualizará automáticamente ");
    setTimeout(function() {
      location.reload(true);
    }, 2000);

  });


  $("#ajustes-btn").click(function() {
    var tel_final = localStorage.getItem('tel_v');
    $("input#telefono").val(tel_final);
    $('#modal-ajustes').modal({
                        backdrop: 'static',
                        keyboard: true,
                        show: true
                });
  });


  //EndPoint para petición Breeze
;
  var bfamily = "AAAMIACTC";
  var btype = "AAAMIACTCPANIC";
  var bversion = "1.0";


  $("#ajustes-frm").submit(function() {
    event.preventDefault();
    var datos = $("#ajustes-frm").serializeArray();
    var formData = JSON.parse(JSON.stringify(jQuery('#ajustes-frm').serializeArray()))
    var tel_v = datos["0"].value;
    var endpoint_v = datos["1"].value;
    var debug_v = datos["3"].value;
    var agente_v = datos["2"].value;
    console.log(datos);
    localStorage.setItem("tel_v", tel_v);
    localStorage.setItem("endpoint_v", endpoint_v);
    localStorage.setItem("debug_v", debug_v);
    localStorage.setItem("agente_v", agente_v);
    $('#modal-ajustes').modal('hide');
    $('#modal-informacion').modal({
                        backdrop: 'static',
                        keyboard: true,
                        show: true
                });
    $("#mensaje-modal").text("Tus ajustes se han guardado. Recargando");
    setTimeout(function() {
      location.reload(true);
    }, 5000);


  });

  if (navigator.geolocation) {
    console.log('Geolocalizacion Activada, esperando evento');
    var startPos;
    var geoSuccess = function(position) {
      startPos = position;
      var lat = startPos.coords.latitude;
      var long = startPos.coords.longitude;
      var coordenadas = lat + "," + long;
      console.log("Coordenadas: " + coordenadas);
      var tel_final = localStorage.getItem('tel_v');
      var levelEl = $("span#level").text();
//      var eventBody = "{\"phoneNumber\":\"" + tel_final + "\",\"latitude\":\"" + lat + "\",\"longitude\":\"" + long + "\"}";
      var eventBody = "{\n\"phoneNumber\":\""+ tel_final +"\",\n\"latitude\":\"" + lat + "\",\n\"longitude\":\"" + long + "\",\n\"batteryPhone\":\""+ levelEl +"\", \n\"agentPhone\":\""+ agente +"\"\n}"

      postbreeze(bfamily, btype, bversion, tel_final, endpoint, eventBody);

    };
  } else {
    console.log('Geolocation no disponible');
    console.log('Ha ocurrido un error con los permisos del GPS ');
    $('#modalerrores').modal('show');
    $('#mensajeerror').text("Ha ocurrido un Error con los permisos del GPS ");
  }

  $("#callbtn").click(function() {
    var geoError = function(error) {
      switch (error.code) {
        case 0:
          console.log('Ha ocurrido un Error Desconocido con el GPS: ');
          $('#modalerrores').modal('show');
          $('#mensajeerror').text("Ha ocurrido un Error Desconocido con el GPS: ");
          break;
        case 1:
          console.log('Ha ocurrido un error con los permisos del GPS ');
          $('#modalerrores').modal('show');
          $('#mensajeerror').text("Ha ocurrido un Error con los permisos del GPS ");
          break;
        case 2:
          console.log('Tu equipo no cuenta con GPS o no se puede acceder a el');
          $('#modalerrores').modal('show');
          $('#mensajeerror').text("Tu equipo no cuenta con GPS o no se puede acceder a el");
          break;
        case 3:
          console.log('No se pudo conectar al GPS');
          $('#modalerrores').modal('show');
          $('#mensajeerror').text("No se puede conectar al GPS");
          break;
        default:
          console.log('Este error no se ha implementadp:' + error.code);
          $('#modalerrores').modal('show');
          $('#mensajeerror').text("Este error no s eha implementado" + error.code);
          break;
      }
    };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

    //Por si queremos qu eesté reportando en Tiempo Real las Coordenadas

    // var watchId = navigator.geolocation.watchPosition(function(position) {
    //   var lat = startPos.coords.latitude;
    //   var long = startPos.coords.longitude;
    //   var coordenadas = lat + "," + long;
    //   console.log("Coordenadas RealTime: " + coordenadas);
    // });
    if (typeof(Storage) !== "undefined") {} else {
      console.log("tu dispositivo no cuenta con localStorage");
    }

  });
});



function postbreeze(bfamily, btype, bversion, tel_final, endpoint, eventBody) {
  var data = new FormData();
  data.append("family", bfamily);
  data.append("type", btype);
  data.append("version", bversion);
  data.append("eventBody", eventBody);
  try {
    var postdata = $.ajax({
      url: endpoint,
      type: "POST",
      data:  data,
      contentType: false,
      cache: false,
      processData:false,
      error: function(xhr, status, errorThrown) {
        console.log("Ha ocurrido un error: ");
        console.log(xhr.statusText +" " +  xhr.status);
        alert(" Ha ocurrido un error ! ");


  },
        success: function (xhr, status, error, exception, event, options) {
          console.log("Peticion Correcta");
              console.log(status);
              console.log(xhr.statusText);
                alert(" Done ! ");

        }
    });
}
catch(err) {
    console.log(err.message);
}



}


// Testing
console.log("Iniciando Logger");
