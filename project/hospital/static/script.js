const MAX_QUEUE = 10;

function getCSRFToken() {
  return document.querySelector("[name=csrfmiddlewaretoken]").value;
}

$("#insertbtn").on("click", function (e) {
  e.preventDefault();
  const name = $("#name").val();
  const severity = $("#severity").val();

  if (!name || !severity) {
    alert("Please enter name and severity");
    return;
  }

  $.ajax({
    url: "/insert/",
    method: "POST",
    contentType: "application/json",
    headers: { "X-CSRFToken": getCSRFToken() },
    data: JSON.stringify({ name, severity }),
    success: function () {
      $("#name").val("");
      $("#severity").val("");
      fetchQueue();
    },
    error: function () {
      alert("Something went wrong!");
    },
  });
});

let previousPatientIds = [];

function fetchQueue() {
  $.get("/queue/", function (data) {
    const container = $("#queue-boxes");
    const newQueue = data.queue;
    const currentIds = newQueue.map((p) => p.id);

    const newPatientId = currentIds.find(
      (id) => !previousPatientIds.includes(id)
    );
    const removedPatientId = previousPatientIds.find(
      (id) => !currentIds.includes(id)
    );

    if (removedPatientId) {
      const removedBox = $(`.queue-box[data-id="${removedPatientId}"]`);
      if (removedBox.length) {
        removedBox.addClass("animate-dequeue-reverse");
        setTimeout(() => {
          renderQueue(container, newQueue, newPatientId);
          previousPatientIds = currentIds;
        }, 800);
        return;
      }
    }

    renderQueue(container, newQueue, newPatientId);
    previousPatientIds = currentIds;
  });
}

function renderQueue(container, queue, newPatientId) {
  container.empty();

  queue.forEach((patient) => {
    const animationClass = patient.id === newPatientId ? "animate-enqueue" : "";
    const popoverId = `popover-${patient.id}`;

    const box = $(`
      <div class="relative group">
        <div id="btn-${patient.id}"
          data-popover-target="${popoverId}"
          class="queue-box bg-blue-700 w-[100px] h-[100px] rounded-lg border-blue-700 border-2 flex items-center justify-center ${animationClass} cursor-pointer"
          data-id="${patient.id}">
          <span class="text-black text-4xl font-semibold">${patient.severity}</span>
        </div>

        <div data-popover
          id="${popoverId}"
          role="tooltip"
          class="absolute top-full left-1/2 z-10 invisible opacity-0 transform -translate-x-1/2 mt-2 w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
      
 
          <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-zinc-800">
            <h3 class="font-semibold text-gray-900 dark:text-white">Patient Details</h3>
          </div>
    
  
          <div class="px-3 py-2 dark:bg-zinc-900">
            <p class="text-gray-200"><strong>Name:</strong> ${patient.name}</p>
            <p class="text-gray-200"><strong>Severity:</strong> ${patient.severity}</p>
          </div>

          <div data-popper-arrow></div>
        </div>
      </div>
    `);

    container.append(box);

    const btn = document.getElementById(`btn-${patient.id}`);
    const pop = document.getElementById(popoverId);

    let hideTimeout;

    btn.addEventListener("mouseenter", () => {
      clearTimeout(hideTimeout);
      pop.classList.remove("invisible", "opacity-0");
      pop.classList.add("visible", "opacity-100");
    });

    btn.addEventListener("mouseleave", () => {
      hideTimeout = setTimeout(() => {
        pop.classList.add("invisible", "opacity-0");
        pop.classList.remove("visible", "opacity-100");
      }, 200);
    });

    pop.addEventListener("mouseenter", () => {
      clearTimeout(hideTimeout);
    });

    pop.addEventListener("mouseleave", () => {
      hideTimeout = setTimeout(() => {
        pop.classList.add("invisible", "opacity-0");
        pop.classList.remove("visible", "opacity-100");
      }, 200);
    });
  });
}

$(document).ready(function () {
  fetchQueue();
});
