//
// Foundation-Jekyll - Javascripts
// Author: @aaronkwhite
//

// Init Foundation
$(document).foundation();

$(document).ready(function(){

  $('#day-image').bind('mouseover', slideImageUpDay);
  $('#day-image').bind('mouseout', slideImageDownDay);
  $('#night-image').bind('mouseover', slideImageUpNight);
  $('#night-image').bind('mouseout', slideImageDownNight);

    $("#flip").click(function(){
        $("#panel").slideDown("slow");
    });

});

function slideImageUpDay() {
    $( "#day-image" ).animate({opacity: 0})
    $(".hidden-text-day").animate({
      opacity: 1.0
    }, 300, function() {

    });
};

function slideImageDownDay() {
  $( "#day-image" ).animate({opacity: 1})
  $(".hidden-text-day").animate({
    opacity: 0.0
  }, 300, function() {

  });
};

function slideImageUpNight() {
    $( "#night-image" ).animate({opacity: 0})
    $(".hidden-text-night").animate({
      opacity: 1.0
    }, 300, function() {

    });
};

function slideImageDownNight() {
  $( "#night-image" ).animate({opacity: 1})
  $(".hidden-text-night").animate({
    opacity: 0.0
  }, 300, function() {

  });
};
