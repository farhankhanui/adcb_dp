$(document).ready(function () {
  let mql = window.matchMedia("(min-width: 1025px)");

  if (mql.matches) {
    var rightItem = document.getElementById("item1");
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
  }
});
