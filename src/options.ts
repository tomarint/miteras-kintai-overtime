// Saves options to chrome.storage
function save_options() {
  const estimateOvertime = document.querySelector<HTMLSelectElement>(
    "#estimateOvertimeSelect"
  );
  if (estimateOvertime == null) {
    return;
  }
  chrome.storage.sync.set(
    {
      estimateOvertime:
        estimateOvertime.options[estimateOvertime.selectedIndex].value,
    },
    function () {
      // Update status to let user know options were saved.
      const status = document.querySelector<HTMLElement>("#status");
      if (status != null) {
        console.log(
          "save estimateOvertime: ",
          estimateOvertime.options[estimateOvertime.selectedIndex].value
        );
        status.textContent = "Saved!";
        setTimeout(function () {
          status.textContent = "";
        }, 750);
      }
    }
  );
}

// Restores select box state using the preferences stored in chrome.storage.
function restore_options() {
  // Use default value
  chrome.storage.sync.get(
    {
      estimateOvertime: "1",
    },
    function (items) {
      const estimateOvertime = document.querySelector<HTMLSelectElement>(
        "#estimateOvertimeSelect"
      );
      if (estimateOvertime != null) {
        console.log("restore estimateOvertime: ", items.estimateOvertime);
        estimateOvertime.value = items.estimateOvertime;
      }
    }
  );
}

document.addEventListener("DOMContentLoaded", restore_options);
document.querySelector("#save")?.addEventListener("click", save_options);
