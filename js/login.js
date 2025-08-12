const firebaseConfig = {
  apiKey: "AIzaSyDv7KY5HChj6kfFPczPlWbNcYfy4nvWn7Q",
  authDomain: "webpage-bd792.firebaseapp.com",
  databaseURL: "https://webpage-bd792-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "webpage-bd792",
  storageBucket: "webpage-bd792.appspot.com",
  messagingSenderId: "1053781095525",
  appId: "1:1053781095525:web:732ecab6c36884bc8e828c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  if (user) {

    showAlreadyLoggedInMessage();
  }
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const user = auth.currentUser;
  if (user) {
    showAlreadyLoggedInMessage();
    return;
  }
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const email = username; 

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.href = 'home.html';
    })
    .catch((error) => {
      alert(getFriendlyErrorMessage(error.code));
    });
});

function showAlreadyLoggedInMessage() {
  const formCard = document.querySelector('.form-card');
  const existingMessage = document.querySelector('.already-logged-in');
  
  if (!existingMessage) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'already-logged-in';
    messageDiv.innerHTML = `
      <p style="color: green; margin-bottom: 15px;">Već ste prijavljeni!</p>
      <a href="home.html" class="form-btn">Idi na početnu</a>
      <button onclick="logout()" class="form-btn" style="background: #dc3545; margin-top: 10px;">Odjavi se</button>
    `;
    formCard.appendChild(messageDiv);
  
    document.getElementById('loginForm').style.display = 'none';
    document.querySelector('.form-note').style.display = 'none';
  }
}

function logout() {
  auth.signOut().then(() => {
    window.location.reload();
  }).catch((error) => {
    alert('Došlo je do greške prilikom odjave: ' + error.message);
  });
}

function getFriendlyErrorMessage(errorCode) {
  switch(errorCode) {
    case 'auth/invalid-email': return 'Nevažeća email adresa.';
    case 'auth/user-disabled': return 'Korisnički račun je deaktiviran.';
    case 'auth/user-not-found': return 'Korisnik s ovim podacima ne postoji.';
    case 'auth/wrong-password': return 'Pogrešna lozinka.';
    case 'auth/too-many-requests': return 'Previše neuspjelih pokušaja. Pokušajte ponovo kasnije.';
    default: return 'Došlo je do greške prilikom prijave. Pokušajte ponovo.';
  }
}