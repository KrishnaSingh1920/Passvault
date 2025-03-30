// Setup default login password if not set.
if (!localStorage.getItem('loginPassword')) {
  localStorage.setItem('loginPassword', 'KS');
}

// Retrieve saved cards or initialize empty array.
let cards = JSON.parse(localStorage.getItem('cards')) || [];
let deleteIndex = null; // to store index of card to delete

const loginContainer = document.getElementById('loginContainer');
const appContainer = document.getElementById('appContainer');
const loginButton = document.getElementById('loginButton');
const loginPasswordInput = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const forgotPasswordButton = document.getElementById('forgotPassword');
const logoutButton = document.getElementById('logout');
const cardsContainer = document.getElementById('cardsContainer');
const plusButton = document.getElementById('plusButton');

// Modal Elements for adding card
const addModal = document.getElementById('modal');
const closeAddModal = document.getElementById('closeAddModal');
const addCardButton = document.getElementById('addCardButton');
const cardTitleInput = document.getElementById('cardTitle');
const cardPasswordInput = document.getElementById('cardPassword');

// Modal Elements for changing password
const changeModal = document.getElementById('changePasswordModal');
const closeChangeModal = document.getElementById('closeChangeModal');
const changePasswordButton = document.getElementById('changePasswordButton');
const changeError = document.getElementById('changeError');
const oldPasswordInput = document.getElementById('oldPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Modal Elements for confirming deletion
const confirmDeleteModal = document.getElementById('confirmDeleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

// Theme toggle button
const themeToggle = document.getElementById('themeToggle');

// Helper to show error messages with transition
function showError(elem, message) {
  elem.innerText = message;
  if (message.includes("successfully")) {
    elem.classList.add('success');
  } else {
    elem.classList.remove('success');
  }
  elem.classList.add('visible');
  setTimeout(() => {
    elem.classList.remove('visible');
  }, 3000);
}

// Function to render cards on the page with fade animation
function renderCards() {
  cardsContainer.innerHTML = "";
  cards.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = card.title;
    cardDiv.appendChild(title);
    
    const subheading = document.createElement('p');
    subheading.className = 'card-subheading';
    subheading.textContent = card.password;
    cardDiv.appendChild(subheading);
    
    // Create delete button at top right
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-button';
    deleteBtn.innerHTML = '<img src="Delete Icon.png" alt="Delete"  style="filter: invert(var(--changeinv));">';
    deleteBtn.addEventListener('click', () => {
      deleteIndex = index;
      confirmDeleteModal.classList.add('show');
    });
    cardDiv.appendChild(deleteBtn);
    
    // Create copy button with the provided clipboard icon at bottom right
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-button';
    copyBtn.innerHTML = '<img src="Copy Icon.png" alt="Copy" style="filter: invert(var(--changeinv));">';
    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(card.password);
      } else {
        let textArea = document.createElement("textarea");
        textArea.value = card.password;
        textArea.style.position = "fixed";
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = 0;
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback: Unable to copy', err);
        }
        document.body.removeChild(textArea);
      }
    });
    cardDiv.appendChild(copyBtn);
    
    cardsContainer.appendChild(cardDiv);
  });
  // Animate cards container fade in
  cardsContainer.style.opacity = 0;
  setTimeout(() => { cardsContainer.style.opacity = 1; }, 100);
}

// Login functionality
loginButton.addEventListener('click', () => {
  const userInput = loginPasswordInput.value;
  const storedPassword = localStorage.getItem('loginPassword');
  if (userInput === storedPassword) {
    loginError.innerText = "";
    loginContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    plusButton.classList.remove('hidden');
    renderCards();
  } else {
    showError(loginError, "Incorrect password. Please try again.");
  }
});

// Open change password modal
forgotPasswordButton.addEventListener('click', () => {
  changeError.innerText = "";
  oldPasswordInput.value = "";
  newPasswordInput.value = "";
  confirmPasswordInput.value = "";
  changeModal.classList.add('show');
});

// Close add card modal
function closeAddModalWithAnimation() {
  addModal.classList.remove('show');
  cardTitleInput.value = "";
  cardPasswordInput.value = "";
}
closeAddModal.addEventListener('click', closeAddModalWithAnimation);

// Close change password modal
function closeChangeModalWithAnimation() {
  changeModal.classList.remove('show');
  changeError.innerText = "";
  oldPasswordInput.value = "";
  newPasswordInput.value = "";
  confirmPasswordInput.value = "";
}
closeChangeModal.addEventListener('click', closeChangeModalWithAnimation);

// Close modals when clicking outside modal content
window.addEventListener('click', (event) => {
  if (event.target === addModal) {
    closeAddModalWithAnimation();
  }
  if (event.target === changeModal) {
    closeChangeModalWithAnimation();
  }
});

// Open add card modal
plusButton.addEventListener('click', () => {
  addModal.classList.add('show');
});

// Add new card
addCardButton.addEventListener('click', () => {
  const title = cardTitleInput.value.trim();
  const password = cardPasswordInput.value.trim();
  if (title && password) {
    const newCard = { title, password };
    cards.push(newCard);
    localStorage.setItem('cards', JSON.stringify(cards));
    renderCards();
    closeAddModalWithAnimation();
  } else {
    showError(loginError, "Both fields are required!");
  }
});

// Change password functionality (modal remains open on success)
changePasswordButton.addEventListener('click', () => {
  const oldPass = oldPasswordInput.value.trim();
  const newPass = newPasswordInput.value.trim();
  const confirmPass = confirmPasswordInput.value.trim();
  const currentPass = localStorage.getItem('loginPassword');
  if (oldPass !== currentPass) {
    showError(changeError, "Old password is incorrect.");
    return;
  }
  if (newPass === "" || confirmPass === "") {
    showError(changeError, "New password fields cannot be empty.");
    return;
  }
  if (newPass !== confirmPass) {
    showError(changeError, "New passwords do not match.");
    return;
  }
  localStorage.setItem('loginPassword', newPass);
  showError(changeError, "Password changed successfully!");
  // Modal remains open on success.
});

// Logout functionality
logoutButton.addEventListener('click', () => {
  loginContainer.classList.remove('hidden');
  appContainer.classList.add('hidden');
  plusButton.classList.add('hidden');
  loginPasswordInput.value = "";
});

// Confirm delete functionality
confirmDeleteBtn.addEventListener('click', () => {
  if (deleteIndex !== null) {
    cards.splice(deleteIndex, 1);
    localStorage.setItem('cards', JSON.stringify(cards));
    renderCards();
    deleteIndex = null;
  }
  confirmDeleteModal.classList.remove('show');
});

cancelDeleteBtn.addEventListener('click', () => {
  deleteIndex = null;
  confirmDeleteModal.classList.remove('show');
});

// Allow login with Enter key
loginPasswordInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    loginButton.click();
  }
});

// Move focus on Enter in Add Card form
cardTitleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    cardPasswordInput.focus();
  }
});
cardPasswordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addCardButton.click();
  }
});

// Move focus on Enter in Change Password form
oldPasswordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    newPasswordInput.focus();
  }
});
newPasswordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    confirmPasswordInput.focus();
  }
});
confirmPasswordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    changePasswordButton.click();
  }
});

// Theme toggle functionality with smooth transition for overall theme change
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});

