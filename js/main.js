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
  var canvas = Snap(".svg-canvas");
  var item = Snap(".robot-container");
  var bob;
  var righteye;
  var lefteye;

  Snap.load('/images/Bob_Bot.svg', function (response) {

      bob = response.select("#bob");
      response.select("#right-eye").attr({
        fill: 'white'
      })
      response.select("#left-eye").attr({
        fill: 'white'
      })
      righteye = response.select("#right-eye");
      lefteye = response.select("#left-eye");

      // This fills in Bob's body.
      bob.selectAll("path").attr({
        fill: "#BC6666"
      })

      /*
      item.hover(function () {
          eyePop(righteye, lefteye);
        }, function(){
          eyeReturn(righteye, lefteye);
        }
      );
      */

      canvas.append(bob);
      canvas.append(righteye);
      canvas.append(lefteye);
    });


    // EYE POP ANIMATION
    var eyePopFlag = true;

    var interval = self.setInterval(function(){
      if(eyePopFlag){eyePopAndReturn(righteye, lefteye)}
      else{eyeReturn(righteye, lefteye)}
      },400);


    function eyePop(righteye, lefteye){

      var randomTime = (Math.floor((Math.random() * 10) + 1)) * 25;

      var randomRightEyePop = Math.floor((Math.random() * 10) + 1)
      var randomLeftEyePop = Math.floor((Math.random() * 10) + 1)

      var back = ["#ff0000","blue","gray", "red", "green", "silver"];
      var randColor = back[Math.floor(Math.random() * back.length)];

      lefteye.stop(false, true).animate({
        fill: randColor.toString(),
        rx: 30 + randomLeftEyePop,
        ry: 30 + randomLeftEyePop
      }, randomTime, mina.easeinout);
      righteye.stop(false, true).animate({
        fill: randColor.toString(),
        rx: 30 + randomRightEyePop,
        ry: 30 + randomRightEyePop
      }, randomTime, mina.easeinout);
      eyePopFlag = false;
    }

    function eyeReturn(righteye, lefteye){

      righteye.stop(false, true).animate({
        fill: "black",
        rx: 27,
        ry: 27
      }, 250, mina.easeinout);

      lefteye.stop(false, true).animate({
        fill: "black",
        rx: 27,
        ry: 27,
        rotate: 20
      }, 250, mina.easeinout);
      eyePopFlag = true;
    }
    // END EYE POP


});




// Table of Contents title. Change text to localize
$("#markdown-toc").prepend("<li><h6>Overview</h6></li>");
