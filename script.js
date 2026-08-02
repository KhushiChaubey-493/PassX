const form = document.querySelector("form");
const websiteInput = document.getElementById("website");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const copiedText = document.getElementById("copied");
const table = document.querySelector("table");

function getPasswords() {
  return JSON.parse(localStorage.getItem("passwords")) || [];
}

function savePasswords(passwords) {
  localStorage.setItem("passwords", JSON.stringify(passwords));
}

function maskPassword(password) {
  return "*".repeat(password.length);
}

function showCopiedMessage() {
  if (!copiedText) return;

  copiedText.style.display = "inline";

  setTimeout(() => {
    copiedText.style.display = "none";
  }, 1500);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showCopiedMessage();
  } catch {
    alert("Clipboard copying failed");
  }
}

function deletePassword(index) {
  const passwords = getPasswords();

  passwords.splice(index, 1);

  savePasswords(passwords);
  showPasswords();
}

function showPasswords() {
  const passwords = getPasswords();

  table.innerHTML = `
    <tr>
      <th>Website</th>
      <th>Username</th>
      <th>Password</th>
      <th>Actions</th>
    </tr>
  `;

  if (passwords.length === 0) {
    table.innerHTML += `
      <tr>
        <td colspan="4">No passwords saved yet</td>
      </tr>
    `;
    return;
  }

  passwords.forEach((item, index) => {
    table.innerHTML += `
      <tr>
        <td>
          ${item.website}
          <button class="copy-btn" data-copy="${item.website}" type="button">Copy</button>
        </td>

        <td>
          ${item.username}
          <button class="copy-btn" data-copy="${item.username}" type="button">Copy</button>
        </td>

        <td>
          ${maskPassword(item.password)}
          <button class="copy-btn" data-copy="${item.password}" type="button">Copy</button>
        </td>

        <td>
          <button class="btnsm delete-btn" data-index="${index}" type="button">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const passwords = getPasswords();

  passwords.push({
    website: websiteInput.value.trim(),
    username: usernameInput.value.trim(),
    password: passwordInput.value
  });

  savePasswords(passwords);
  form.reset();
  showPasswords();

  alert("Password saved");
});

table.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const index = Number(event.target.dataset.index);
    deletePassword(index);
  }

  if (event.target.classList.contains("copy-btn")) {
    copyText(event.target.dataset.copy);
  }
});

showPasswords();