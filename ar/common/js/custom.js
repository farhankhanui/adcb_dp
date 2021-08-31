function counterAnimation() {
  var elem = $(".horizontal-scroll--list");
  var elemOffset = elem.offset().top;

  var windowTop;
  var limit = 300;

  function parallax() {
    elem.css({
      "-webkit-transform":
        "translate3d(" + 100 * (windowTop / limit) + "px,0,0)",
      "-ms-transform": "translate3d(" + 100 * (windowTop / limit) + "px,0,0)",
      transform: "translate3d(" + 100 * (windowTop / limit) + "px,0,0)",
    });
  }

  $(window).on("scroll", function () {
    windowTop = $(window).scrollTop() - elemOffset + 400;
    window.requestAnimationFrame(parallax);
  });
}

var swiper = new Swiper('.featured', {
  pagination: '.swiper-pagination',
  direction: 'horizontal',
  slidesPerView: 6,
  paginationClickable: true,
  spaceBetween: 30,
  mousewheel: true,
  speed: 500,
});

// Language switcher script copied form ADCB live site

var swiper = new Swiper(".testimonials-slider", {
  loop: true,
  slidesPerView: 2.2,
  spaceBetween: 0,   
  speed: 500,
  navigation: {   
    nextEl: ".testi-swiper-button-next.fst",
    prevEl: ".testi-swiper-button-prev.fst",
  },
});

var testiSwiper = new Swiper(".testimonials-slider-1", {
  loop: true,
  slidesPerView: 2.2,
  spaceBetween: 0,
  speed: 500,
  navigation: {
    nextEl: ".testi-swiper-button-next.snd",
    prevEl: ".testi-swiper-button-prev.snd",
  },
})
   


//Swiper update
$('.o-tabs__tab-nav-link').on('click', function () {
  setTimeout(function () {
    testiSwiper.update();
  }, 100);

});

// Tabs 
$(function () {
  $.FindContainer = function () {
    $('.tab-content>div').each(function findcontent() {
      var newindex = $('.activetab').index();
      var otherindex = $(this).index();
      var substractindex = otherindex - newindex;
      var currentwidth = $('.partners').width();
      var newpositions = substractindex * currentwidth;
      $(this).animate({
        'left': newpositions
      });
    });
  };
  $.FindId = function () {
    $('.tab-content>div').each(function () {
      if ($(this).attr('id') == $('.active').attr('data-Id')) {
        $('.tab-content>div').removeClass('activetab');
        $(this).addClass('activetab');
      }
    });
  };
  $('.tab-buttons>span').first().addClass('active');

  $('.tab-content>div').each(function () {
    var activeid = $('.active').attr('data-Id');
    console.log(activeid);
    if ($(this).attr('id') == activeid) {
      $(this).addClass('activetab');
    }
    var currentheight = $('.activetab').height();
    var currentwidth = $('.partners').width();
    var currentindex = $(this).index();
    var currentposition = currentindex * currentwidth;
    $(this).css({
      'left': currentposition,
      'width': currentwidth - 40,

    });
    $(this).attr('data-position', currentposition);

  });

  $('.tab-buttons>span').click(function () {
    $('.tab-buttons>span').removeClass('active');
    $(this).addClass('active');
    var currentid = $('.active').attr('id');
    $.FindId();
    $.FindContainer();
  });

});

AOS.init();


$(document).ready(function () {
  counterAnimation();
});
