// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2tv4165DJJ7Jx9lOai4AbeXvAl1NnuaU",
    authDomain: "happyschool-99f85.firebaseapp.com",
    databaseURL: "https://happyschool-99f85-default-rtdb.firebaseio.com",
    projectId: "happyschool-99f85",
    storageBucket: "happyschool-99f85.appspot.com",
    messagingSenderId: "746962281225",
    appId: "1:746962281225:web:dfe0364b17a93d8f5b29d8",
    measurementId: "G-WQ77M4NHGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

const register = document.getElementById('register');
register.addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if the passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    if (email && password && confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                alert("User Registered Successfully");
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert("Error: " + errorMessage);
            });
    } else {
        alert("Please fill in all fields.");
    }
});
