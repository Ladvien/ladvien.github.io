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

  var getMax = function(){
      return $(document).height() - $(window).height();
  }

  var getValue = function(){
      return $(window).scrollTop();
  }

  if('max' in document.createElement('progress')){
      // Browser supports progress element
      var progressBar = $('progress');

      // Set the Max attr for the first time
      progressBar.attr({ max: getMax() });

      $(document).on('scroll', function(){
          // On scroll only Value attr needs to be calculated
          progressBar.attr({ value: getValue() });
      });

      $(window).resize(function(){
          // On resize, both Max/Value attr needs to be calculated
          progressBar.attr({ max: getMax(), value: getValue() });
      });
  }
  else {
      var progressBar = $('.progress-bar'),
          max = getMax(), 
          value, width;

      var getWidth = function(){
          // Calculate width in percentage
          value = getValue();
          width = (value/max) * 100;
          width = width + '%';
          return width;
      }

      var setWidth = function(){
          progressBar.css({ width: getWidth() });
      }

      $(document).on('scroll', setWidth);
      $(window).on('resize', function(){
          // Need to reset the Max attr
          max = getMax();
          setWidth();
      });
  }


});




// Table of Contents title. Change text to localize
$("#markdown-toc").prepend("<li><h6>Overview</h6></li>");
