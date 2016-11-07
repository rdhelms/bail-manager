angular.module('portfolio').controller('projectsCtrl', function(Projects, $state) {
  var backgroundCanvas = document.getElementById('backgroundCanvas');
  var bgContext = backgroundCanvas.getContext('2d');
  var bgWidth = backgroundCanvas.width;
  var bgHeight = backgroundCanvas.height;
  var bgBoxSize = 10;
  var speed = 3;
  var time = 0;
  if (!Projects.running) {
    Projects.running = true;
    var loopHandle = setInterval(bgDraw, 40);
  }
  function bgDraw() {
    bgContext.fillStyle = 'rgba(0, 0, 100, 0.1)';
    bgContext.fillRect(0, 0, bgWidth, bgHeight);
    for (var x = 0; x < bgWidth; x++) {
      var amp1 = (-1 * bgHeight * Math.sin(time * (Math.PI / 180)) / 4);
      var y1 = bgHeight/2 + amp1 * Math.sin( x * (360 / 700) * (Math.PI / 180) - speed * time / 200);
      var amp2 = (-1 * bgHeight * Math.sin(time * (Math.PI / 180)) / 6);
      var y2 = bgHeight/2 + amp2 * Math.sin( 2 * x * (360 / 700) * (Math.PI / 180) - speed * time / 400);
      bgContext.fillStyle = 'white';
      bgContext.fillRect(x, y1, 1, 1);
      bgContext.fillRect(x, y2, 1, 1);
      bgContext.fillRect(x, (y1 + y2) / 2 + 5, 1, 1);
      bgContext.fillRect(x, (2*y2 - y1) - 5, 1, 1);
    }
    time += speed;
    if (time > 3600) {
      time = 0;
    }
  }

  $('.name').on('mouseenter', function() {
    $('.contactLink a').slideDown();
  });
  $('.name').on('mouseleave', function() {
    setTimeout(function() {
      $('.contactLink a').slideUp();
    }, 1000);
  });
});
