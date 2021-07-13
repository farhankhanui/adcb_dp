//Submit the reset password form.
$("#resetpassword-form").submit(function(e) {
    $.get('/admin/Portal.svc/ResetMyPassword()?Username=\'' + encodeURIComponent($('input#username').val().trim()) + '\'', function(data, status) {
        if (status == "success")
            window.location.href = "/admin/app/check-your-email";
    });
    return false;
});

//For fetching the theme settings like logo.
fetchThemeSettings($(".generic-logo-size"));