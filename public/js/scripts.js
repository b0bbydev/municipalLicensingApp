// create functions to fill in form fields for test buttons.
function userLogin() {
  document.getElementById("email").value = "bjonkman@townofbwg.com";
}

// create function to unhide the address history table.
function toggleAddressHistory() {
  var addressHistorySection = document.getElementById("addressHistorySection");
  addressHistorySection.style.display =
    addressHistorySection.style.display === "none" ? "" : "none";
}

// create function to fill out form.
function fillForm() {
  document.getElementById("firstName").value = "Test";
  document.getElementById("lastName").value = "Test";
  document.getElementById("poBoxAptRR").value = "Test";
  document.getElementById("address").value = "Test";
  document.getElementById("town").value = "Test";
  document.getElementById("postalCode").value = "Test";
  document.getElementById("homePhone").value = "123-123-1234";
  document.getElementById("cellPhone").value = "123-123-1234";
  document.getElementById("workPhone").value = "123-123-1234";
  document.getElementById("email").value = "test@test.com";
}
