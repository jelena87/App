var userPrimaryColor = "#355469";
var userSecondaryColor = "#212121";

window.onload = function ()
{
    // sets the underline-border for the input elements
    var list = document.getElementsByClassName("login-input");

    for (var i = 0; i < list.length; i++)
    {
        list[i].addEventListener("focus", function ()
        {
            this.style.borderBottom = "1px solid " + userPrimaryColor;
        });

        list[i].addEventListener("blur", function ()
        {
            this.style.borderBottom = "1px solid #AAA";
        })
    }

    // sets the background for the login-header
    document.getElementById("div_login_loginheader").style.backgroundColor = userPrimaryColor;

    // sets the background for the login-submit-button
    document.getElementById("bt_login_submit").style.backgroundColor = userPrimaryColor;
    document.getElementById("bt_login_submit").style.borderColor = userPrimaryColor;

    // sets the background for the language dropdown button
    document.getElementById("div_login_languagedropdown").style.backgroundColor = userPrimaryColor;

    //// sets the color of the icons
    //var list = document.getElementsByClassName("login-icons");
    //var i = 0;

    //for (i = 0; i < list.length; i++)
    //{
    //    list[i].style.color = userPrimaryColor;
    //}
}

/* When the user clicks on the language button,
toggle between hiding and showing the dropdown content */
function showLanguageDropDown()
{
    $('#dp_login_languagedropdown').toggle("show");
}

window.onclick = function (event)
{
    var matches = event.target.matches ? event.target.matches('.language-dropdown-div') || event.target.matches('.language-dropdown-div-item') : event.target.msMatchesSelector('.language-dropdown-div') || event.target.msMatchesSelector('.language-dropdown-div-item');

    if (!matches && $("#dp_login_languagedropdown").css('display') == 'block')
    {
        $('#dp_login_languagedropdown').toggle("show");
    }
}