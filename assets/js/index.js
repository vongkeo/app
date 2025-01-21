const featured = [
  {
    title: "Number to Words",
    img: "https://getbootstrap.com/docs/5.3/examples/features/unsplash-photo-1.jpg",
    href: "number-to-words.html",
    icon: "fas fa-file-alt",
  },
  {
    title: "Beautiful Json Viewer",
    img: "https://getbootstrap.com/docs/5.3/examples/features/unsplash-photo-3.jpg",
    href: "json-viewer.html",
    icon: "fas fa-code",
  },
  {
    title: "Images To Any Format",
    img: "https://getbootstrap.com/docs/5.3/examples/features/unsplash-photo-4.jpg",
    href: "images-to-any-format.html",
    icon: "fas fa-image",
  },
];

const featuredCardsContainer = document.getElementById("featured-cards");

if (featuredCardsContainer) {
  featured.forEach((item) => {
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
        <a href="${item.href}" class="text-decoration-none">
          <div class="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg" style="background-image: url('${item.img}');">
            <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
              <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold
              text-capitalize
              ">${item.title}</h3>
              <ul class="d-flex list-unstyled mt-auto">
                <li class="me-auto">
                  <i class="${item.icon} fa-2x"></i>
                </li>
                <li class="d-flex align-items-center me-3">
                  <svg class="bi me-2" width="1em" height="1em">
                    <use xlink:href="#geo-fill"></use>
                  </svg>
                  <small>Vong</small>
                </li>
                <li class="d-flex align-items-center">
                  <svg class="bi me-2" width="1em" height="1em">
                    <use xlink:href="#calendar3"></use>
                  </svg>
                  <small>3d</small>
                </li>
              </ul>
            </div>
          </div>
        </a>
      `;
    featuredCardsContainer.appendChild(card);
  });
}

function syntaxHighlight(json) {
  if (typeof json !== "string") {
    json = JSON.stringify(json, null, 2);
  }
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

function formatJSON() {
  try {
    const input = document.getElementById("jsonInput").value;
    const parsedJSON = JSON.parse(input);
    const formatted = syntaxHighlight(JSON.stringify(parsedJSON, null, 2));
    document.getElementById("jsonOutput").innerHTML = formatted;
  } catch (error) {
    document.getElementById("jsonOutput").innerHTML =
      "Invalid JSON: " + error.message;
  }
}

function copyToClipboard() {
  const jsonOutput = document.getElementById("jsonOutput");
  const textArea = document.createElement("textarea");
  textArea.value = jsonOutput.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);

  // Show temporary "Copied!" feedback
  const copyBtn = document.querySelector(".btn-copy");
  const originalText = copyBtn.textContent;
  copyBtn.textContent = "Copied!";
  setTimeout(() => {
    copyBtn.textContent = originalText;
  }, 1500);
}

// convert image
$(document).ready(function () {
  const dropZone = $("#dropZone");
  const fileInput = $("#fileInput");
  const fileInfo = $("#fileInfo");
  const imagePreview = $("#imagePreview");
  const fileName = $("#fileName");
  const fileSize = $("#fileSize");
  const imageDimensions = $("#imageDimensions");
  const convertBtn = $("#convertBtn");
  const progressBar = $("#progressBar");
  const errorMessage = $("#errorMessage");
  const loadingOverlay = $("#loadingOverlay");

  let currentFile = null;
  let processedBlob = null;

  // Prevent default drag behaviors
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropZone.on(eventName, preventDefaults);
    $(document).on(eventName, preventDefaults);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Highlight drop zone when dragging over it
  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.on(eventName, highlight);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.on(eventName, unhighlight);
  });

  function highlight(e) {
    dropZone.addClass("dragover");
  }

  function unhighlight(e) {
    dropZone.removeClass("dragover");
  }

  // Handle dropped files
  dropZone.on("drop", handleDrop);
  dropZone.on("click", () => fileInput.click());
  fileInput.on("change", (e) => handleFiles(e.target.files));

  function handleDrop(e) {
    const dt = e.originalEvent.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  async function handleFiles(files) {
    if (files.length > 0) {
      const file = files[0];
      currentFile = file;

      // Show file info
      fileName.text(file.name);
      fileSize.text(formatFileSize(file.size));

      try {
        loadingOverlay.css("display", "flex");

        // Check if file is HEIC/HEIF
        if (
          file.name.toLowerCase().endsWith(".heic") ||
          file.name.toLowerCase().endsWith(".heif")
        ) {
          // Convert HEIC to JPEG blob
          processedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
          });
        } else {
          processedBlob = file;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            imageDimensions.text(`${img.width} x ${img.height}`);
            imagePreview.attr("src", e.target.result);
            fileInfo.show();
            convertBtn.prop("disabled", false);
            errorMessage.hide();
            loadingOverlay.hide();
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(processedBlob);
      } catch (error) {
        loadingOverlay.hide();
        showError("Error processing image. Please try another file or format.");
        console.error("Error:", error);
      }
    }
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function showError(message) {
    errorMessage.text(message).show();
    fileInfo.hide();
  }

  // Handle conversion and download
  convertBtn.on("click", async function () {
    if (!processedBlob) {
      showError("Please select an image first.");
      return;
    }

    progressBar.show();
    const progress = progressBar.find(".progress-bar");
    progress.css("width", "0%");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let width = 0;
      const interval = setInterval(() => {
        width += 5;
        progress.css("width", width + "%");

        if (width >= 100) {
          clearInterval(interval);

          const format = $("#formatSelect").val();
          const mimeType = "image/" + format;
          const fileName = currentFile.name.replace(/\.[^/.]+$/, "");
          const fullFileName = `${fileName}-converted.${format}`;

          canvas.toBlob(
            (blob) => {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = fullFileName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);

              progressBar.hide();
            },
            mimeType,
            0.8
          );
        }
      }, 50);
    };

    img.src = URL.createObjectURL(processedBlob);
  });
});
