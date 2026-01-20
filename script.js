// 🔥 PASTE YOUR firebaseConfig HERE
const firebaseConfig = {
  apiKey: "AIzaSyCcTAdHdM_xxzrcT7JFFaPEvNEkwGGapG0",
  authDomain: "food-rescue-1cfc8.firebaseapp.com",
  projectId: "food-rescue-1cfc8",
  storageBucket: "food-rescue-1cfc8.firebasestorage.app",
  messagingSenderId: "571196450384",
  appId: "1:571196450384:web:5b316891a8a4e65bd79355"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// View switching
function showDonor() {
  document.getElementById("donorSection").style.display = "block";
  document.getElementById("ngoSection").style.display = "none";
}

function showNGO() {
  document.getElementById("donorSection").style.display = "none";
  document.getElementById("ngoSection").style.display = "block";
}

// Post food
function postFood() {
  const name = document.getElementById("donorName").value;
  const food = document.getElementById("foodDetails").value;
  const location = document.getElementById("location").value;

  if (!name || !food || !location) {
    alert("Fill all fields");
    return;
  }

  db.collection("foods").add({
    donor: name,
    food: food,
    location: location,
    time: firebase.firestore.FieldValue.serverTimestamp()
  });

  // CLEAR INPUTS (optional but nice)
  document.getElementById("donorName").value = "";
  document.getElementById("foodDetails").value = "";
  document.getElementById("location").value = "";
}

  alert("Food posted!");
}

// Real-time NGO view
db.collection("foods").orderBy("time", "desc")
  .onSnapshot(snapshot => {
    const list = document.getElementById("foodList");
    //list.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `${food.food} | ${food.location} | by ${food.donor}
<button>Claim</button>`;

      list.appendChild(li);
    });
  });

// Claim food

function claimFood(button, location) {
  button.outerHTML = `<span style="color: green; font-weight: bold;">
    📍 Location: ${location}
  </span>`;
}

