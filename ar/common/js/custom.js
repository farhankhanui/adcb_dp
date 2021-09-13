var autoHeight = false;
if ($(window).width() <= 768) {
    autoHeight = true
}

var swiper = new Swiper(".testimonials-slider", {
  loop: true,
  autoHeight: autoHeight,
  slidesPerView: "auto",
  spaceBetween: 0,
  speed: 500,
  navigation: {
    nextEl: ".testi-swiper-button-next.fst",
    prevEl: ".testi-swiper-button-prev.fst",
  },
 
});


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
        left: -newpositions,
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
      left: -currentposition,
      width: currentwidth - 40,
    });
    $(this).attr("data-position", -currentposition);
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

AOS.init({
  once: true,
});

   
