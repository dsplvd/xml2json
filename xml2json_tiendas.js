var fs = require('fs');
var request = require('request');
var libxmljs = require("libxmljs");

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

fs.readFile(process.argv[2]+'.xml', 'utf8', function (error, data) {
    var tiendasXml = data;
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
	var geo = geoTemp.split("+");
	var nodo = getData(tiendasXml[i], 'referencia_plano');
	var logo = getData(tiendasXml[i], 'logo');
	var piso = getData(tiendasXml[i], 'piso');
	var area = getData(tiendasXml[i], 'sector');
	tiendasJson.push({
		nombre: nombre,
		rubro: rubro,
		productos: productos,
		nodo: nodo,
		logo: logo,
		piso: piso,
		geo: geo,
		geoTemp: geoTemp,
		area: area
	});
}

tiendasJson = sortJSON(tiendasJson, 'nombre');	
tiendasJson = JSON.stringify(tiendasJson, null, 4);
fs.writeFile(process.argv[2]+'.json', tiendasJson, function (err) {
  if (err) throw err;
  console.log('tiendas.json saved');
});
});