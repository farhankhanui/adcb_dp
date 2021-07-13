//For checking the signUp functionality is enable or not. IF enable than dispaly sign-up button.
checkSignUp($("#register"));
var tenant = window.location.hostname.split(".")[0];

//Fetching the navigation list.
$.get("/admin/navigation", function(data, status) {
    for (var key in data) {
        var dataArray = data[key];
        if (dataArray.length > 0) {
            $.each(dataArray, function(i, el) {
                $(".navigation ul").append("<li><a href=" + el.url + ">" + el.title + "</a></li>");
            });
        }
    }
});

//For fetching the theme settings like logo.
fetchThemeSettings($(".generic-logo-size"));

$.get("/api/" + tenant + "/api-management/1.0/api-catalogs", function(data, status) {
    if (data.results) {
        var publicAPI = 0,
            privateAPI = 0;
        data.results.forEach(element => {
            if (element.accessStatus === "PUBLIC") {
                $tr = $('<tr>').insertAfter($('#publicAPI'));
                publicAPI++;
            } else {
                $tr = $('<tr>').insertAfter($('#privateAPI'));
                privateAPI++;
            }
            $td = $('<td>').appendTo($tr);
            $td.text(element.name);
            $button = $('<button>');
            $button.text("Download").addClass("download");
            $td.append($button);
        });
        if (publicAPI == 0) {
            $h3 = $('<h3>').insertAfter($('#publicAPI'));
            $h3.text("No public API Available");
        }
        if (privateAPI == 0) {
            $h3 = $('<h3>').insertAfter($('#privateAPI'));
            $h3.text("No private API Available");
        }
    }
});

$.get("/admin/sessionCheck", function(data, status) {})
    .done(function() {
        $(".login-signUp").hide();
    })
    .fail(function() {
        $h3 = $('<h3>').insertAfter($('#privateAPI'));
        $h3.text("Login to view the private APIs");
    });