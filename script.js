// 🔥 Firebase config (keep yours)
const firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Switch Views
function showDonor() {
  document.getElementById("donorSection").style.display = "block";
  document.getElementById("ngoSection").style.display = "none";
}

function showNGO() {
  document.getElementById("donorSection").style.display = "none";
  document.getElementById("ngoSection").style.display = "block";
}

// Add food (Donor)
function addFood() {
  const donor = document.getElementById("donor").value;
  const food = document.getElementById("food").value;
  const location = document.getElementById("location").value;

  db.collection("food_posts").add({
    donor,
    food,
    location,
    status: "Available",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Food posted successfully!");
}

// Read food (NGO)
db.collection("food_posts").onSnapshot((snapshot) => {
  const list = document.getElementById("foodList");
  list.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();

    if (data.status === "Available") {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${data.food}</strong><br>
        📍 ${data.location}<br>
        👤 ${data.donor}
      `;
      list.appendChild(li);
    }
  });
});
