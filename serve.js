var Static = require('node-static');
var Fs = require('fs');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new(Static.Server)('./');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    if (request.url === '/') {
      var lecture = Fs.readFileSync('slides.md').toString();
      var x = Fs.readFileSync('template.html').toString().split('DATA_GOES_HERE');
      response.end(x[0] + lecture + x[1], 'utf8');
      return;
    }
    file.serve(request, response);
  }).resume();
}).listen(8000);
