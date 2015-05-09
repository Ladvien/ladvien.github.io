//
// Foundation-Jekyll - Javascripts
// Author: @aaronkwhite
//

// Init Foundation
$(document).foundation();

$(document).ready(function(){

  $('#day-image').bind('mouseover', slideImageUp);
  $('#day-image').bind('mouseout', slideImageDown);

    $("#flip").click(function(){
        $("#panel").slideDown("slow");
    });

    $( "#night-image" ).hover(function() {

      $( "#night-image" ).animate({
        opacity: 0//,
        //left: "+=50",
        //height: "toggle"
      }, 300, function() {
        hidden: true
      });



    });



});

function slideImageUp() {
    $( "#day-image" ).animate({opacity: 0})
    $(".hidden-text").animate({
      opacity: 1.0
    }, 300, function() {

    });
};

function slideImageDown() {
  $( "#day-image" ).animate({opacity: 1})
  $(".hidden-text").animate({
    opacity: 0.0
  }, 300, function() {

  });
};
