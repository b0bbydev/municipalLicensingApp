/*
 * Public js.
 */

// create function to unhide the address history table.
function toggleAddressHistory() {
  var addressHistorySection = document.getElementById("addressHistorySection");
  addressHistorySection.style.display =
    addressHistorySection.style.display === "none" ? "" : "none";
}

// create function to unhide the dog history table.
function toggleDogHistory() {
  var dogHistorySection = document.getElementById("dogHistorySection");
  dogHistorySection.style.display =
    dogHistorySection.style.display === "none" ? "" : "none";
}

// create function to unhide the address history table.
function toggleProcedureHistory() {
  var procedureHistorySection = document.getElementById(
    "procedureHistorySection"
  );
  procedureHistorySection.style.display =
    procedureHistorySection.style.display === "none" ? "" : "none";
}

// create function to unhide the dog history table.
function toggleGuidelineHistory() {
  var guidelineHistorySection = document.getElementById(
    "guidelineHistorySection"
  );
  guidelineHistorySection.style.display =
    guidelineHistorySection.style.display === "none" ? "" : "none";
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
