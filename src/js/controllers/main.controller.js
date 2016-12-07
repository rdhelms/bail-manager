angular.module('portfolio').controller('mainCtrl', function(Projects, $state) {
  var backgroundCanvas = document.getElementById('backgroundCanvas');
  var bgContext = backgroundCanvas.getContext('2d');
  var bgWidth = backgroundCanvas.width;
  var bgHeight = backgroundCanvas.height;
  var bgBoxSize = 10;
  var speed = 2;
  var time = 0;
  var mouseMoveEvent;
  var mouseMove = false;
  if (!Projects.running) {
    Projects.running = true;
    var loopHandle = setInterval(bgDraw, 40);
  }
  function bgDraw() {
    bgContext.fillStyle = 'rgba(0, 0, 100, 0.05)';
    bgContext.fillRect(0, 0, bgWidth, bgHeight);
    for (var x = 0; x < bgWidth; x++) {
      var amp1 = (-1 * bgHeight * Math.sin(time * (Math.PI / 180)) / 4);
      var y1 = bgHeight + amp1 * Math.sin( x * (360 / 700) * (Math.PI / 180) - speed * time / 200);
      var amp2 = (-1 * bgHeight * Math.sin(time * (Math.PI / 180)) / 6);
      var y2 = bgHeight + amp2 * Math.sin( 2 * x * (360 / 700) * (Math.PI / 180) - speed * time / 400);
      var ampMouse = 0;
      var yMouse = 0;
      if (mouseMove) {
        ampMouse = mouseMoveEvent.clientY * (bgHeight / window.innerHeight) - bgHeight/2;
        yMouse = ampMouse * Math.cos( (x - mouseMoveEvent.clientX * (bgWidth / window.innerWidth) ) * (Math.PI / 180) / 2 );
      }
      bgContext.fillStyle = 'white';
      bgContext.fillRect(x, (y1 + yMouse) / 2, 1, 1);
      bgContext.fillRect(x, (y2 + yMouse) / 2, 1, 1);
      bgContext.fillRect(x, (y1 + y2 + yMouse) / 3 + 5, 1, 1);
      bgContext.fillRect(x, (y1 + y2 + yMouse) / 3 - 5, 1, 1);
      bgContext.fillRect(x, (y1 + y2 + yMouse) / 3 + 10, 1, 1);
    }

    time += speed;
    if (time > 3600) {
      time = 0;
    }
  }

  this.hideNav = function() {
    $('.linkItems').removeClass('active');
  }

  $('button.navLinks').on('click', function(){
    $('.linkItems').toggleClass('active');
  });

  $('body').on('mousemove', function(event) {
    mouseMoveEvent = event;
    // if (mouseMoveEvent.clientX < (window.innerWidth - 200) || mouseMoveEvent.clientY > (400)) { // Hiding nav links
    //   $('.linkItems').removeClass('active');
    // }
    mouseMove = true;
  });
});
