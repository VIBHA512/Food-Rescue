// 🔥 PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyCV3eJ7L9cTcqyzKRn1WP_TDm3QNzBn7QM",
  authDomain: "food-rescue-124ad.firebaseapp.com",
  projectId: "food-rescue-124ad",
  storageBucket: "food-rescue-124ad.firebasestorage.app",
  messagingSenderId: "591994110578",
  appId: "1:591994110578:web:ea6ee825ac0e707e9db8eb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore reference
const db = firebase.firestore();

// Add food data
function addFood() {
  const donor = document.getElementById("donor").value;
  const food = document.getElementById("food").value;
  const location = document.getElementById("location").value;

  db.collection("food_posts").add({
    donor: donor,
    food: food,
    location: location,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Food posted successfully!");
}

// Read food data
db.collection("food_posts").onSnapshot((snapshot) => {
  const list = document.getElementById("foodList");
  list.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerText = `${data.food} | ${data.location} | by ${data.donor}`;
    list.appendChild(li);
  });
});
