const firebaseConfig = {
  apiKey: "AIzaSyDv7KY5HChj6kfFPczPlWbNcYfy4nvWn7Q",
  authDomain: "webpage-bd792.firebaseapp.com",
  databaseURL: "https://webpage-bd792-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "webpage-bd792",
  storageBucket: "webpage-bd792.firebasestorage.app",
  messagingSenderId: "1053781095525",
  appId: "1:1053781095525:web:732ecab6c36884bc8e828c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

document.getElementById('registrationForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const ime = document.getElementById('ime').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!validateEmail(email)) {
    alert('Unesite ispravnu email adresu');
    return;
  }
  
  if (password.length < 6) {
    alert('Lozinka mora imati najmanje 6 znakova');
    return;
  }
  

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

      const user = userCredential.user;

      const userData = {
        ime: ime,
        email: email,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };
      
      return database.ref('users/' + user.uid).set(userData);
    })
    .then(() => {
 
      alert('Registracija uspješna!');
      window.location.href = 'login.html'; 
    })
    .catch((error) => {

      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Registration error:', errorCode, errorMessage);
      alert(getFriendlyErrorMessage(errorCode));
    });
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function getFriendlyErrorMessage(errorCode) {
  switch(errorCode) {
    case 'auth/email-already-in-use':
      return 'Email adresa se već koristi.';
    case 'auth/invalid-email':
      return 'Nevažeća email adresa.';
    case 'auth/operation-not-allowed':
      return 'Operacija nije dopuštena.';
    case 'auth/weak-password':
      return 'Lozinka je previše slaba. Unesite jaču lozinku.';
    default:
      return 'Došlo je do greške prilikom registracije: ' + errorCode;
  }
}