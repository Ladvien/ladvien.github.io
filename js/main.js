---
---
// Off Canvas Sliding
$(document).ready(function(){
  // Menu button click
  $('#js-menu-trigger,#js-menu-screen').on('click touchstart', function(e){
    // $('#js-body').toggleClass('no-scroll');
    $('#js-menu, #js-menu-screen').toggleClass('is-visible');
    $('#js-menu-trigger').toggleClass('slide close');
    // $('#masthead, #page-wrapper').toggleClass('slide');
    e.preventDefault();
  });

  // JS
  var canvas = Snap("#svg-canvas");
  var item = Snap("#robot-container");

  Snap.load('/images/Bob_Bot.svg', function (response) {

      var bob = response.select("#bob");
      var righteye = response.select("#right-eye");
      var lefteye = response.select("#left-eye");
      var handler;

      // EYE POP ANIMATION
      item.hover(function () {
              righteye.stop(false, true).animate({
                fill: 'green',
                rx: 37,
                ry: 37
              }, 250, mina.easeinout);

              lefteye.stop(false, true).animate({
                fill: 'red',
                rx: 25,
                ry: 20
              }, 250, mina.easeinout);


        }, function(){
            righteye.stop(false, true).animate({
              fill: 'white',
              rx: 27,
              ry: 27
            }, 250, mina.easeinout);

            lefteye.stop(false, true).animate({
              fill: 'white',
              rx: 27,
              ry: 27,
              rotate: 20

            }, 250, mina.easeinout);
          }
        );
      // END EYE POP

      canvas.append(righteye);
      canvas.append(lefteye);
      canvas.append(bob);

    });
  });
      /*  Good for interval based animations.
      bob.hover(function () {
        handler = window.setInterval(function () {
            //righteye.attr({ opacity: 0})
            righteye.animate({
              fill: 'black'
            }, 600, null, function () {
              //
            });
            lefteye.animate({
              fill: 'black'
            }, 600, null, function () {
              //
            });
        }, 20);
      }, function () {
          window.clearInterval(handler);
          righteye.animate({
                fill: 'white'
            }, 20);

          lefteye.animate({
            fill: 'white'
          }, 20);
      }); */





// Table of Contents title. Change text to localize
$("#markdown-toc").prepend("<li><h6>Overview</h6></li>");
