// override the global 4 space indent rule
/*jshint indent:2 */

// declare global variables which will be used in this file.
/*global alert */

/* legal */
var hello = function (name) {
  alert('Hello, ' + name);
};

/* illegal, redefinition of global symbol
var alert = 1;
*/

/* illegal, shadowing of x
(function () {
  var x = 'hi';
  if (x === 'hi') {
    var x = 0;
    x++;
  }
})();
*/

/* illegal double equals instead of triple equals
if (alert == "function alert() { [native code] }") { alert('alert is a native function'); }
*/

/* legal alternative (but not very platform independent) */
if (String(alert) === "function alert() { [native code] }") { alert('alert is a native function'); }


/* illegal: this doesn't do what it looks like it does
if (hello = alert) { hello('alert'); }
*/

/* legal (if you really insist) */
if ((hello = alert)) { hello('hello now aliases alert which is not undefined'); }

/* illegal: unbracketed ifs were not safe with CPP macros and now nobody likes the look anymore
if (hello === alert) alert('hello is now alert!');
*/
