// == Get elements ==
const cameraVideo = document.getElementById("camera");
const cameraBtn = document.querySelector(".camera-btn");
const photoSlots = document.querySelectorAll(".photo-slot");
const retakeBtn = document.querySelector(".retake-btn");
const downloadBtn = document.querySelector(".download-btn");
const kuromiStrip = document.querySelector(".kuromi-photostrip");

let stream;

// == Start camera ==
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraVideo.srcObject = stream;
        cameraVideo.style.display = "block";
        return true;
    } catch (err) {
        alert("Cannot access camera. Please allow camera permissions.");
        console.error(err);
        return false;
    }
}

// == Stop camera ==
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    cameraVideo.srcObject = null;
    cameraVideo.style.display = "none"; // Hide camera preview
}

// == Take a photo and set as background ==
function takePhoto(slot) {
    const canvas = document.createElement("canvas");
    canvas.width = cameraVideo.videoWidth;
    canvas.height = cameraVideo.videoHeight;
    const ctx = canvas.getContext("2d");

    // Mirror the image horizontally
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);

    slot.style.backgroundImage = `url(${canvas.toDataURL("image/png")})`;
    slot.style.backgroundSize = "cover";
    slot.style.backgroundPosition = "center";

    // Flash effect
    const flash = document.getElementById("camera-flash");
    flash.style.opacity = "1";
    setTimeout(() => {
        flash.style.opacity = "0";
    }, 150);
}

// == Countdown and photo capture sequence ==
async function startPhotoshoot() {
    const cameraStarted = stream || await startCamera();
    if (!cameraStarted) return; // Stop if camera not allowed

    cameraBtn.disabled = true;
    cameraVideo.style.display = "block";

    for (let i = 0; i < photoSlots.length; i++) {
        let timer = 3;
        cameraBtn.innerHTML = timer;

        await new Promise(resolve => {
            const countdown = setInterval(() => {
                timer--;
                cameraBtn.innerHTML = timer > 0 ? timer : "Smile!";
                if (timer <= 0) {
                    clearInterval(countdown);
                    takePhoto(photoSlots[i]);
                    cameraBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
                        <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
                        <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                    </svg>`;
                    resolve();
                }
            }, 1000);
        });
    }

    cameraBtn.disabled = false;
    cameraBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
        <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
        <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
        </svg>`;
    stopCamera(); // Hide camera after photoshoot
}

// == Retake button ==
retakeBtn.addEventListener("click", () => {
    photoSlots.forEach(slot => slot.style.backgroundImage = "");
    cameraBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
        <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
        <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
    </svg>`;
    stopCamera();
});

downloadBtn.addEventListener("click", () => {
    // Save current background of kuromiStrip
    const kuromiBg = kuromiStrip.style.background;

    // Set only kuromiStrip background to transparent for download
    kuromiStrip.style.background = "transparent";

    html2canvas(kuromiStrip, { useCORS: true, allowTaint: true, backgroundColor: null }).then(canvas => {
        canvas.toBlob(blob => {
            const link = document.createElement("a");
            link.download = "kuromi-photostrip.png";
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        });

        // Restore kuromiStrip background
        kuromiStrip.style.background = kuromiBg;
    });
});

// == Camera button click ==
cameraBtn.addEventListener("click", () => {
    // Check if all photo slots are filled
    const allFilled = Array.from(photoSlots).every(slot => slot.style.backgroundImage);

    if (allFilled) {
        // Clear all photo slots before starting new photoshoot
        photoSlots.forEach(slot => slot.style.backgroundImage = "");
    }

    startPhotoshoot();
});