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

$(document).ready(function () {
  counterAnimation();
});
