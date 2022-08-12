/*
 * @author Bobby Jonkman
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
