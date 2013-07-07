/**
* @param {string} name
*/
var hello = function(name) {
  alert('Hello, ' + name);
};

var y = 'New User';
hello(y);

var x = {};
// You can't do this, it will fail the build if you try.
//hello(x);
