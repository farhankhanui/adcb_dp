$("#organization-name").blur(function() {
    if ($(this).val()) {
        //Checking the organization name is unique or not.
        $.getJSON('/admin/Portal.svc/OrganizationNameUnique()?Name=\'' + encodeURIComponent($(this).val().trim()) + '\'', function(data, status) {
            if (!data.d.result) {
                $(".validation.organization").show();
            }
        });
    }
});

$("#organization-name").focus(function() {
    $(".validation.organization").hide();
});

//For fetching the theme settings like logo.
fetchThemeSettings($(".generic-logo-size"));

//Submit the sign-up form.
$("form#signUp-Form").submit(function() {
    var formData = $("#signUp-Form").serializeArray();
    var model = {};
	var orgName = model.OrganizationName;
	var uniqueOrgDataJSON;
	var obj;
	var isOrgUnique;
	
    $.each(formData, function(i, el) {
        model[el.name] = el.value;
    });
    model["Uuid"] = "{{GENERATED_GUID}}"
	
	//Fetching JSON Response from OrganizationNameUnique()
	uniqueOrgDataJSON = $.ajax({
			url: '/admin/Portal.svc/OrganizationNameUnique()?Name=\'' + model.OrganizationName + '\'',
			type: 'get',
			contentType: 'application/json',
			dataType: 'json',
			success: function (data) 
			{
				return data;
			},
        async: false
			}).responseText;
			
	obj = JSON.parse(uniqueOrgDataJSON);
	
	//Parsing Parameter to identify if the Organization Name is Unique or Not
	isOrgUnique = obj.d.result
	
	if (!isOrgUnique) {
        $(".validation.organization").text("Organization name is already taken");
        $(".validation.organization").show();
        return false;
    }
			
    if (model.cnfemail !== model.Email) {
        $(".validation.signUp").text("Email and confirm email should be same.");
        $(".validation.signUp").show();
        return false;
    }
		
    delete model.cnfemail;
    model = JSON.stringify(model);
    $.ajax({
        url: "/admin/Portal.svc/Registrations",
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: model,
        success: function(data) {
            window.location.href = "/admin/app/check-your-email?registration-success=true";
        },
        error: function(data) {
            $(".validation.signUp").text("SignUp Failed.");
            $(".validation.signUp").show();
        }
    });
    return false;
});