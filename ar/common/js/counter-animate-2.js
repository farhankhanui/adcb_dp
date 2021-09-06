$(document).ready(function () {
  let mql = window.matchMedia("(min-width: 1025px)");

  if (mql.matches) {
    var elem = $("#item1");
    var elemOffset = elem.offset().top;

    var windowTop;
    var limit = 110;

    function parallax() {
      elem.css({
        "-webkit-transform":
          "translate3d(" + 100 * (windowTop / limit) + "px,0,0)",
        "-ms-transform":
          "translate3d(" + 100 * (windowTop / limit) + "px,0,0)",
        transform: "translate3d(" + 100 * (windowTop / limit) + "px,0,0)",
      });
    }

    $(window).on("scroll", function () {
      windowTop = $(window).scrollTop();
      window.requestAnimationFrame(parallax);
    });
  }

  /* if (mql.matches) {
    var rightItem = document.getElementById("item1");
    console.clear();
    console.log("test");
    (function () {
      var throttle = function (type, name, obj) {
        var obj = obj || window;
        var running = false;
        var func = function () {
          if (running) {
            return;
          }
          running = true;
          requestAnimationFrame(function () {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
          });
        };
        obj.addEventListener(type, func);
      };

      throttle("scroll", "optimizedScroll");
    })();

    window.addEventListener("optimizedScroll", function () {
      console.log(window.pageYOffset);
      rightItem.style.transform = "translate(-" + window.pageYOffset + "px)";
    });
  } */
});
