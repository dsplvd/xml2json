var fs = require('fs');
var request = require('request');
var libxmljs = require("libxmljs");

var downloadImg = function(uri, filename, callback){
	request.head(uri, function(err, res, body){
		var r = request(uri).pipe(fs.createWriteStream(filename));
		r.on('close', callback);
  });
};

var splitFilename = function (str) {
    return str.split('\\').pop().split('/').pop();
}

function getData(array, valor) {
  var input = array.find(valor);
  if (!input[0].child(0)) { input = "null" }
  else { input = input[0].child(0).text(); }
  return input;
}

function sortJSON(data, key) {
    return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

request.get('http://mallplaza.cl/xml/tiendas.php?siteid=mallplaza-'+process.argv[2], function (error, response, body) {
    if (!error && response.statusCode == 200) {
    var tiendasXml = body;
    tiendasXml = libxmljs.parseXmlString(tiendasXml);
	tiendasXml = tiendasXml.find('//tienda');
	var tiendasJson = [];

for (i=0;i<tiendasXml.length;i++) {
	var nombre = getData(tiendasXml[i], 'nombre');
	var rubro = getData(tiendasXml[i], 'categorias');
	if (typeof rubro === "string") { rubro = rubro.split(',');}
	var productos = getData(tiendasXml[i], 'tags');	
	if (typeof productos === "string") { productos = productos.split(',');}
	var geoTemp = getData(tiendasXml[i], 'local');
	var geo = geoTemp.split();
	var nodo = getData(tiendasXml[i], 'referencia_plano');
	var logo = getData(tiendasXml[i], 'logo');
	var piso = getData(tiendasXml[i], 'piso');
	var area = getData(tiendasXml[i], 'sector');
	var logoLocal = splitFilename(logo);
	logoLocal.trim();
	logoLocal.replace(/\s+/g, '_');
	logoLocal.toLowerCase();
	logoLocal = process.argv[2]+'/img/'+logoLocal;
	rutaLogoLocal = '/home/ddmallplaza/mall/backpack/'+logoLocal;
	downloadImg(logo, logoLocal, function(){});
	tiendasJson.push({
		nombre: nombre,
		rubro: rubro,
		productos: productos,
		nodo: nodo,
		logo: logo,
		logoLocal: rutaLogoLocal,
		piso: piso,
		geo: geo,
		geoTemp: geoTemp,
		area: area
	});
}

tiendasJson = sortJSON(tiendasJson, 'nombre');	
tiendasJson = JSON.stringify(tiendasJson, null, 4);
fs.writeFile(process.argv[2]+'/tiendas.json', tiendasJson, function (err) {
  if (err) throw err;
  console.log('tiendas.json saved');
});
}
});

request.get('http://mallplaza.cl/xml/descuentos.php?siteid=mallplaza-'+process.argv[2], function (error, response, body) {
    if (!error && response.statusCode == 200) {
    var descuentosXml = body;
	descuentosXml = libxmljs.parseXmlString(descuentosXml);
descuentosXml = descuentosXml.find('//descuento');
var descuentosJson = [];

for (i=0;i<descuentosXml.length;i++) {
	var tienda = getData(descuentosXml[i], 'tienda');
	var finicio = getData(descuentosXml[i], 'fecha_inicio');
	var ftermino = getData(descuentosXml[i], 'fecha_termino');
	var imagen = getData(descuentosXml[i], 'imagen');
	var imagenLocal = splitFilename(imagen);
	imagenLocal.trim();
	imagenLocal.replace(/\s+/g, '_');
	imagenLocal.toLowerCase();
	imagenLocal = process.argv[2]+'/img/'+imagenLocal;
	rutaImagenLocal = '/home/ddmallplaza/mall/backpack/'+imagenLocal;
	downloadImg(imagen, imagenLocal, function(){});
	descuentosJson.push({
	tienda: tienda,
	finicio: finicio,
	ftermino: ftermino,
	imagen: imagen,
	imagenLocal: rutaImagenLocal
	});
	}
descuentosJson = JSON.stringify(descuentosJson, null, 4);
fs.writeFile(process.argv[2]+'/descuentos.json', descuentosJson, function (err) {
  if (err) throw err;
  console.log('descuentos.json saved');
});
}
});

request.get('http://mallplaza.cl/xml/eventos.php?siteid=mallplaza-'+process.argv[2], function (error, response, body) {
    if (!error && response.statusCode == 200) {
    var eventosXml = body;
eventosXml = libxmljs.parseXmlString(eventosXml);
eventosXml = eventosXml.find('//contenido');
var eventosJson = [];

for (i=0;i<eventosXml.length;i++) {
	var titulo = getData(eventosXml[i], 'titulo');
	var descripcion = getData(eventosXml[i], 'introtext');
	var imagen = getData(eventosXml[i], 'afiche');
	var imagenLocal = splitFilename(imagen);
	imagenLocal.trim();
	imagenLocal.replace(/\s+/g, '_');
	imagenLocal.toLowerCase();
	imagenLocal = process.argv[2]+'/img/'+imagenLocal;
	rutaImagenLocal = '/home/ddmallplaza/mall/backpack/'+imagenLocal;
	downloadImg(imagen, imagenLocal, function(){});
	eventosJson.push({
	titulo: titulo,
	descripcion: descripcion,
	imagen: imagen,
	imagenLocal: rutaImagenLocal
	});
	}
eventosJson = JSON.stringify(eventosJson, null, 4);
fs.writeFile(process.argv[2]+'/eventos.json', eventosJson, function (err) {
  if (err) throw err;
  console.log('eventos.json saved');
});
}
});

request.get('http://mallplaza.cl/xml/queestapasando.php?siteid=mallplaza-'+process.argv[2], function (error, response, body) {
    if (!error && response.statusCode == 200) {
    var pasandoXml = body;
pasandoXml = libxmljs.parseXmlString(pasandoXml);
pasandoXml = pasandoXml.find('//contenido');
var pasandoJson = [];

for (i=0;i<pasandoXml.length;i++) {
	var titulo = getData(pasandoXml[i], 'titulo');
	var descripcion = getData(pasandoXml[i], 'descripcion');
	var imagen = getData(pasandoXml[i], 'imagen');
	var imagenLocal = splitFilename(imagen);
	imagenLocal.trim();
	imagenLocal.replace(/\s+/g, '_');
	imagenLocal.toLowerCase();
	imagenLocal = process.argv[2]+'/img/'+imagenLocal;
	rutaImagenLocal = '/home/ddmallplaza/mall/backpack/'+imagenLocal;
	downloadImg(imagen, imagenLocal, function(){});
	pasandoJson.push({
	titulo: titulo,
	descripcion: descripcion,
	imagen: imagen,
	imagenLocal: rutaImagenLocal
	});
	}
pasandoJson = JSON.stringify(pasandoJson, null, 4);
fs.writeFile(process.argv[2]+'/pasando.json', pasandoJson, function (err) {
  if (err) throw err;
  console.log('pasando.json saved');
});
}
});

request.get('http://mallplaza.cl/xml/cine.php?siteid=mallplaza-'+process.argv[2], function (error, response, body) {
    if (!error && response.statusCode == 200) {
    var cineXml = body;
cineXml = libxmljs.parseXmlString(cineXml);
cineXml = cineXml.find('//pelicula');
var cineJson = [];

for (i=0;i<cineXml.length;i++) {
	var titulo = getData(cineXml[i], 'titulo');
	var texto = getData(cineXml[i], 'introtext');
	var horario = getData(cineXml[i], 'horario');
	var afiche = getData(cineXml[i], 'afiche');
	var aficheLocal = splitFilename(afiche);
	aficheLocal.trim();
	aficheLocal.replace(/\s+/g, '_');
	aficheLocal.toLowerCase();
	aficheLocal = process.argv[2]+'/img/'+aficheLocal;
	rutaAficheLocal = '/home/ddmallplaza/mall/backpack/'+aficheLocal;
	downloadImg(afiche, aficheLocal, function(){});
	cineJson.push({
		titulo: titulo,
		texto: texto,
		horario: horario,
		afiche: afiche,
		aficheLocal: rutaAficheLocal
	});
	}
cineJson = JSON.stringify(cineJson, null, 4);
fs.writeFile(process.argv[2]+'/cine.json', cineJson, function (err) {
  if (err) throw err;
  console.log('cine.json saved');
});
	
	}
});
