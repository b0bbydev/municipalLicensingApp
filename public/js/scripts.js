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
  document.getElementById("email").value = "test@test.com";
  document.getElementById("password").value = "Testpass1!";
}

function adminLogin() {
  document.getElementById("email").value = "test@admin.com";
  document.getElementById("password").value = "Testpass1!";
}