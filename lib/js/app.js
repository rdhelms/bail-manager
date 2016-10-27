(function() {
  "use strict";
  var time = 0;
  function draw() {
    $('.background').html('');
    // Draw divs along the entire background, with color dependent on time and their position.
    var boxSize = 5;
    for (var x = 0; x < 100; x += boxSize) {
      for (var y = 0; y < 100; y += boxSize) {
        var r = 0;
        var g = 0;
        var b = Math.round(75 * Math.sin((x + y) * (2 * Math.PI / 100) - ( 0.2* time / 100) ) + 180);
        $('<div>').attr({
          'class': 'bgDesign'
        }).css({
          'position': 'absolute',
          'left': x + 'vw',
          'top': y + 'vh',
          'width': boxSize + 'vw',
          'height': boxSize + 'vh',
          'background': 'rgb(' + r + ',' + g + ',' + b + ')',
        }).appendTo('.background');
      }
    }
  }

  var speed = 30;
  var loopHandle = setInterval(function() {
    time += speed;
    if (time > 100000 || time < 0) {
      speed = -speed;
    }
    draw();
  }, 40);
})();
