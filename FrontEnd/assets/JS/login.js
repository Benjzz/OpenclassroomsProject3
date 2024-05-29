const form = document.querySelector('form');

const email = document.getElementById('email');
const password = document.getElementById('password');

const emailError = document.querySelector('.emailError');
const loginError = document.querySelector('.loginError');

// Logout
function logout() {
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token');

    loginError.innerText = 'Vous avez été déconnecté';
  }
}
logout();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  let user = {
    email: email.value,
    password: password.value,
  };
  login(user);
});

// Login
function login(i) {
  // Vider les messages d'erreurs
  emailError.innerText = '';
  loginError.innerText = '';

  // Vérification de l'email
  if (!i.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
    emailError.innerText = 'Veuillez saisir une adresse e-mail valide';
    return;
  } else {
    fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(i),
    })
      .then((reponse) => reponse.json())
      .then((result) => {
        if (result.error || result.message) {
          loginError.innerText = "L'email ou le mot de passe est incorrect";
        } else {
          window.localStorage.setItem('token', result.token);
          window.location.href = 'index.html';
        }
      });
  }
}
