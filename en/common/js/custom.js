function counterAnimation() {
  var elem = $(".horizontal-scroll--list");
  var elemOffset = elem.offset().top;

  var windowTop;
  var limit = 500;

  function parallax() {
    elem.css({
      "-webkit-transform":
        "translate3d(" + 100 * (windowTop / limit) + "px,0,0)",
      "-ms-transform": "translate3d(" + 100 * (windowTop / limit) + "px,0,0)",
      transform: "translate3d(" + 100 * (windowTop / limit) + "px,0,0)",
    });
  }
  console.log(windowTop / limit);
  $(window).on("scroll", function () {
    windowTop = $(window).scrollTop() - elemOffset + 400;
    window.requestAnimationFrame(parallax);
  });
}

var swiper = new Swiper(".featured", {
  pagination: ".swiper-pagination",
  direction: "horizontal",
  slidesPerView: 6,
  paginationClickable: true,
  spaceBetween: 30,
  mousewheel: true,
  speed: 500,
});

// Language switcher script copied form ADCB live site

var swiper = new Swiper(".testimonials-slider", {
  // loop: true,
  // autoHeight: true,
  slidesPerView: "auto",
  spaceBetween: 0,
  speed: 500,
  navigation: {
    nextEl: ".testi-swiper-button-next.fst",
    prevEl: ".testi-swiper-button-prev.fst",
  },
});

// var testiSwiper = new Swiper(".testimonials-slider-1", {
//   slidesPerView: 'auto',
//   spaceBetween: 35,
//   speed: 500,
//   navigation: {
//     nextEl: ".testi-swiper-button-next.snd",
//     prevEl: ".testi-swiper-button-prev.snd",
//   },
// });

/* const swiperCounter = new Swiper(".c-product-feature__list", {
  freeMode: true,
  slidesPerView: 6,
  centeredSlides: true,
  mousewheel: {
    releaseOnEdges: true,
  },
}); */

//Swiper update
//

// Tabs
$(function () {
  $.FindContainer = function () {
    $(".tab-content>div").each(function findcontent() {
      var newindex = $(".activetab").index();
      var newheight = $(".activetab").height();
      //   $('.tab-content').animate({
      //     'height': newheight+20
      // }, 100);
      $(".tab-content").css("height", newheight + 20);
      var otherindex = $(this).index();
      var substractindex = otherindex - newindex;
      var currentwidth = $(".partners").width();
      var newpositions = substractindex * currentwidth;
      $(this).animate({
        left: newpositions,
      });
    });
  };
  $.FindId = function () {
    $(".tab-content>div").each(function () {
      if ($(this).attr("id") == $(".active").attr("data-Id")) {
        $(".tab-content>div").removeClass("activetab");
        $(this).addClass("activetab");
      }
    });
  };
  $(".tab-buttons>span").first().addClass("active");

  $(".tab-content>div").each(function () {
    var activeid = $(".active").attr("data-Id");

    if ($(this).attr("id") == activeid) {
      $(this).addClass("activetab");
    }
    var currentheight = $(".activetab").height();
    var currentwidth = $(".partners").width();
    var currentindex = $(this).index();
    var currentposition = currentindex * currentwidth;
    $(this).css({
      left: currentposition,
      width: currentwidth - 40,
    });
    $(this).attr("data-position", currentposition);
    $(".tab-content").css("height", currentheight + 20);
  });

  $(".tab-buttons>span").click(function () {
    $(".tab-buttons>span").removeClass("active");
    $(this).addClass("active");
    var currentid = $(".active").attr("id");
    $.FindId();
    $.FindContainer();
  });

  $(".tab-content > #partner").on("click", function () {
    $("span[data-Id='partner']").trigger("click");
  });

  $(".tab-content > #individual").on("click", function () {
    $("span[data-Id='individual']").trigger("click");
  });

  $(window)
    .resize(function () {
      if ($(window).width() <= 768) {
        $(".testimonials .art-image").insertAfter(".testimonials__circle");
      } else {
        $(".testimonials .art-image").insertBefore(".o-tabs__tab-content");
      }
    })
    .resize(); // This will simulate a resize to trigger the initial run.
});

AOS.init({
  once: true,
});

$(window).scroll(function () {
  var w = $(window).scrollTop();
  var f = "translateX(" + -w * 1 + "px)";
  console.log(f);
  $(".cards.features").css({
    transform: f,
  });
});

$(document).ready(function () {
  // counterAnimation();
});
