var Fs = require('fs');

var out = [];
Fs.readFileSync('lecture.txt').toString().split('\n').forEach(function(line) {
  if (line.indexOf('-') === 0) {
    out.push('\n--\n' + line);
  } else if (line === '') {
  } else {
    out.push('\n--\n');
    out.push('\n---\n#' + line);
  }
});

var x = Fs.readFileSync('template.html').toString().split('DATA_GOES_HERE');
Fs.writeFileSync('presentation.html', x[0] + out.join('\n') + x[1]);
