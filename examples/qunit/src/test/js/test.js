define(["main", "jquery"], function(Main, $) {
  QUnit.start();

  asyncTest('Hello AMD is displayed', function() {
    $(function() {
      ok($('body').html().indexOf('<p>Hello AMD!</p>') !== -1);
      start();
    });
  });

});
