// client side password validation.
function pwCheck(confirmPassword) {
  if (confirmPassword.value != document.getElementById("password").value) {
    confirmPassword.setCustomValidity("Passwords must match.");
  } else {
    // if it's valid reset validity message.
    confirmPassword.setCustomValidity("");
  }
} // end of pwCheck().

// create functions to fill in form fields for test buttons.
function userLogin() {
  document.getElementById("email").value = "bjonkman@townofbwg.com";
}

// create function to unhide the "jump to page" pagination.
function togglePagination() {
  var pag = document.getElementById("pagination");
  pag.style.display = pag.style.display === "none" ? "" : "none";
}
