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

//For checking the signUp functionality is enable or not. IF enable than dispaly sign-up button.
checkSignUp($("#register"));

//For fetching the theme settings like logo.
fetchThemeSettings($(".generic-logo-size"), $("#provider-name"));