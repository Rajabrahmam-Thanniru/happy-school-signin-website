// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Firebase configuration
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
const db = getFirestore(app);

// Populate the school dropdown
async function populateSchoolsDropdown() {
  const schoolDropdown = document.getElementById('school');
  const schoolsSnapshot = await getDocs(collection(db, "Schools"));

  schoolsSnapshot.forEach((doc) => {
    const school = doc.data().SchoolName; // Assuming each document has a 'SchoolName' field
    const option = document.createElement('option');
    option.value = doc.id; // Use the document ID to reference the school
    option.text = school;
    schoolDropdown.appendChild(option);
  });
}

// Call the function to populate dropdown on page load
window.addEventListener('load', populateSchoolsDropdown);

// Handle registration
document.getElementById('register').addEventListener("click", async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const gender = document.getElementById('gender').value;
  const phone = document.getElementById('phone').value;
  const Name = document.getElementById('Name').value;
  const schoolId = document.getElementById('school').value;
  const role = document.getElementById('role').value; // Added role field

  // Show loading indicator
  const loading = document.getElementById('loading');
  loading.style.display = 'flex'; // Show the loading spinner

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    loading.style.display = 'none';
    return;
  }

  if (!email || !password || !confirmPassword || !schoolId || !role) { // Added role validation
    alert("Please fill in all fields.");
    loading.style.display = 'none';
    return;
  }

  try {
    // Check the UsersCount field for the selected school
    const schoolRef = doc(db, "Schools", schoolId);
    const schoolSnapshot = await getDoc(schoolRef);

    if (schoolSnapshot.exists()) {
      const usersCount = schoolSnapshot.data().UsersCount;
      const currentlyenrolled = schoolSnapshot.data().currentlyenrolled;

      if (usersCount > 0) {
        // Proceed with user registration
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = doc(db, "Users", email);
        await setDoc(userRef, {
          // Initialize user data, if needed
        });

        await setDoc(doc(db, "Users", email, "userinfo", "userinfo"), {
          email: email,
          gender: gender,
          phone: phone,
          Name: Name,
          school: schoolSnapshot.data().SchoolName,
          role: role, // Store role (teacher/principal)
          coins: 10,
        });

        // Decrease the UsersCount by 1 and increase currently enrolled
        await updateDoc(schoolRef, {
          UsersCount: usersCount - 1,
          currentlyenrolled: currentlyenrolled + 1,
        });

        alert("User registered successfully.");

      } else {
        // Alert if UsersCount is 0
        alert("Sorry, this school is not accepting new registrations.");
      }

    } else {
      alert("Selected school not found.");
    }

  } catch (error) {
    alert("Error: " + error.message);
  } finally {
    loading.style.display = 'none'; // Hide loading indicator
  }
});
