// 🔥 PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
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
