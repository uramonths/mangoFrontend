// Catch elements
const dropArea = document.getElementById('dropArea');
const predictForm = document.getElementById('predictForm');
const previewImg = document.getElementById('previewImg');

const waitingToPredicting = document.querySelector(
  '.result-container #waitingToPredicting',
);
const loadingPredict = document.querySelector('.result-container .loading');
const predictionError = document.querySelector('.result-container #predictionError');
const result = document.querySelector('.result-container #result');

// Form data
const predictFormData = new FormData();

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Prevent submitting form behaviors
['submit'].forEach((eventName) => {
  predictForm.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});
// Remove highlight drop area when item is drag leave
['dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

function highlight() {
  dropArea.classList.add('highlight');
}

function unhighlight() {
  dropArea.classList.remove('highlight');
}

// Handle dropped and submit files
dropArea.addEventListener('drop', dropHandler, false);
predictForm.elements.skinFile.addEventListener('change', skinFileInputHandler);
predictForm.addEventListener('submit', predictFormSubmitHandler);

function dropHandler(event) {
  const dataTransfer = event.dataTransfer;
  const files = dataTransfer.files;

  const skinImage = files[0];
  predictFormData.set('image', skinImage, skinImage.name);

  previewFile(skinImage);
}

// Handle file by input element
function skinFileInputHandler(event) {
  const files = Array.from(event.target.files);

  const skinImage = files[0];
  predictFormData.set('image', skinImage, skinImage.name);

  previewFile(skinImage);
}

// Handle submit form
function predictFormSubmitHandler() {
  if (!predictFormData.has('image')) {
    alert('Silakan pilih gambar Anda terlebih dahulu');
    return;
  }

  uploadFile(predictFormData);
}

// Show preview after choose image
function previewFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = () => {
    previewImg.innerHTML = '';

    const img = document.createElement('img');
    img.src = reader.result;
    previewImg.appendChild(img);
  };
}

// Send image to server
async function uploadFile(formData) {
  try {
    hideElement(waitingToPredicting);
    hideElement(result);
    showElement(loadingPredict);

    const response = await PredictAPI.predict(formData);

    showPredictionResult(response);
    showElement(result);
  } catch (error) {
    console.error(error);

    predictionError.textContent = error.message;
  } finally {
    hideElement(loadingPredict);
  }
}

// Show result to user
function showPredictionResult(response) {
  const { message, data } = response;

  result.innerHTML = `
    <div class="response-message">
      <i class="fas fa-check"></i>
      <span class="message">${message}</span>
    </div>
    <div class="prediction-result">
      <div>
        <div class="result-title">Result:</div>
        <div>${data.result}</div>
      </div>
      <div>
        <div class="result-title">Suggestion:</div>
        <div>${data.suggestion}</div>
      </div>
    </div>
  `;
}

// Catch elements
const registForm = document.getElementById('registForm');
const registError = document.getElementById('registError');
const registSuccess = document.getElementById('registSuccess');

// Form data
const registFormData = new FormData();

// Prevent default form submission behavior
['submit'].forEach((eventName) => {
  registForm.addEventListener(eventName, preventDefaults, false);
});

// Prevent default drag behaviors for form (optional, if you need drag & drop for form)
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  registForm.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

// Handle submit form
registForm.addEventListener('submit', registFormSubmitHandler);

async function registFormSubmitHandler(event) {
  event.preventDefault();  // Prevent form submission

  const formData = new FormData(registForm);

  // Ensure that all required fields are filled
  if (!formData.has('username') || !formData.has('email') || !formData.has('password')) {
    registError.textContent = 'Harap lengkapi semua field!';
    return;
  }

  try {
    const response = await RegistAPI.regist(formData);

    // Check if the registration was successful
    if (response.success) {
      registSuccess.textContent = 'Registrasi berhasil! Mengalihkan ke halaman Mango Detection...';

      // Redirect to the Mango Detection page after a short delay
      setTimeout(() => {
        window.location.href = 'mangoDetection.html';  // Ganti URL sesuai halaman yang diinginkan
      }, 2000);  // 2 detik untuk memberi waktu feedback kepada pengguna
    } else {
      registError.textContent = response.message || 'Terjadi kesalahan saat registrasi.';
    }
  } catch (error) {
    console.error(error);
    registError.textContent = 'Terjadi kesalahan pada server.';
  }
}

// Example of a simple RegistAPI class for the registration API request
class RegistAPI {
  static async regist(data) {
    const response = await fetch(ENDPOINT.regist, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Assuming your API expects JSON
      },
      body: JSON.stringify({
        username: data.get('username'),
        email: data.get('email'),
        password: data.get('password'),
      }),
      redirect: 'follow',
    });

    const json = await response.json();
    return json;
  }
}

