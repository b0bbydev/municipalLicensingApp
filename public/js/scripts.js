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

/* auth helpers */
function adminAuth(modalID) {
  // get current text in input field to append.
  var currentText = document.getElementById(
    "currentAuthLevel-" + modalID
  ).value;

  // check if currentText already contains 'Admin'. If it does, don't add it (return).
  if (currentText.includes("Admin")) {
    document.getElementById("currentAuthLevel-" + modalID).value =
      currentText.replace("Admin,", "");
  } else {
    // add Admin to list.
    document.getElementById("currentAuthLevel-" + modalID).value =
      currentText + "Admin, ";
  }
}

function dogLicenseAuth(modalID) {
  // get current text in input field to append.
  var currentText = document.getElementById(
    "currentAuthLevel-" + modalID
  ).value;

  // check if currentText already contains 'Dog Licenses'. If it does, don't add it (return).
  if (currentText.includes("Dog Licenses")) {
    document.getElementById("currentAuthLevel-" + modalID).value =
      currentText.replace("Dog Licenses,", "");
  } else {
    // add Dog Licenses to list.
    document.getElementById("currentAuthLevel-" + modalID).value =
      currentText + "Dog Licenses, ";
  }
}

function policyAuth(modalID) {
  // get current text in input field to append.
  let currentText = document.getElementById(
    "currentAuthLevel-" + modalID
  ).value;

  // check if currentText already contains 'Policies'. If it does, don't add it (return).
  if (currentText.includes("Policies")) {
    document.getElementById("currentAuthLevel-" + modalID).value =
      currentText.replace("Policies,", "");
  } else {
    // add Policies to list.
    document.getElementById("currentAuthLevel-" + modalID).value =
      currentText + "Policies, ";
  }
}

// display form based on selected option in <select>.
function changeOptions(selectEl) {
  let selectedValue = selectEl.options[selectEl.selectedIndex].value;
  let subForms = document.getElementsByClassName("recordsForm");

  for (let i = 0; i < subForms.length; i += 1) {
    if (selectedValue === subForms[i].name) {
      subForms[i].setAttribute("style", "display:block");
    } else {
      subForms[i].setAttribute("style", "display:none");
    } // end of if-else
  } // end of for.
}
