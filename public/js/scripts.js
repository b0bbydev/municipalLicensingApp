// client side password validation.
function pwCheck(confirmPassword) {
  if (confirmPassword.value != document.getElementById("password").value) {
    confirmPassword.setCustomValidity("Passwords must match.");
  } else {
    // if it's valid reset validity message.
    confirmPassword.setCustomValidity("");
  }
} // end of pwCheck().
