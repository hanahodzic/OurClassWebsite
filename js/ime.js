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

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

      firebase.database().ref('users/' + user.uid).once('value')
        .then((snapshot) => {
          const userData = snapshot.val();
          if (userData && userData.ime) {
            document.getElementById("ime-ucenika").textContent = userData.ime;
          }
        });
    } else {

      document.getElementById("ime-ucenika").textContent = "gost";
    }
  });
