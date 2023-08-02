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

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function createTrialDateFields() {
  // get value from input field.
  let value = document.getElementById("numberOfNewTrialDates").value;

  for (let i = 1; i <= value; i++) {
    // get area to append to.
    let firstRow = document.getElementById("firstRow");
    // create new row.
    let newRow = document.createElement("div");
    newRow.className = "row";
    // create date column.
    var dateCol = document.createElement("div");
    dateCol.className = "col-sm-6";
    // create comment column.
    var commentCol = document.createElement("div");
    commentCol.className = "col-sm-6";
    // create trial date label.
    var trialLabel = document.createElement("label");
    trialLabel.className = "form-label";
    trialLabel.innerHTML = "Additional Trial Date";
    // create trial comment label.
    var commentLabel = document.createElement("label");
    commentLabel.className = "form-label";
    commentLabel.innerHTML = "Trial Comment";
    // create trial date input field.
    var trialDateField = document.createElement("input");
    trialDateField.className = "form-control";
    trialDateField.type = "date";
    trialDateField.name = "trialDateField" + i;
    // create trial comment input field.
    var trialCommentField = document.createElement("input");
    trialCommentField.className = "form-control";
    trialCommentField.placeholder = "Trial Comment";
    trialCommentField.type = "text";
    trialCommentField.name = "trialCommentField" + i;
    // append label and field to dateCol.
    dateCol.appendChild(trialLabel);
    dateCol.appendChild(trialDateField);
    // append lable and field to commentCol.
    commentCol.appendChild(commentLabel);
    commentCol.appendChild(trialCommentField);
    // append col's to row.
    newRow.appendChild(dateCol);
    newRow.appendChild(commentCol);
    insertAfter(firstRow, newRow);
  }
}

// function for download .csv file.
function downloadCSV(csv, filename) {
  const csvBlob = new Blob([csv], { type: "text/csv" });
  const csvURL = URL.createObjectURL(csvBlob);
  const link = document.createElement("a");
  link.href = csvURL;
  link.download = filename;
  link.click();
}
