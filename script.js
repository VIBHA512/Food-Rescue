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

 const imageSelected =
  document.getElementById("foodImage").files.length > 0;

db.collection("foods").add({
  donor: name,
  food: food,
  location: location,
  hasImage: imageSelected,
  time: firebase.firestore.FieldValue.serverTimestamp()
});


  alert("Food posted!");

  document.getElementById("donorName").value = "";
  document.getElementById("foodDetails").value = "";
  document.getElementById("location").value = "";
}




// Real-time NGO view
db.collection("foods").orderBy("time", "desc")
  .onSnapshot(snapshot => {
    const list = document.getElementById("foodList");
    list.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");
   li.innerHTML = `
  ${data.food} | ${data.location} | by ${data.donor}
  <button onclick="claimFood(this, '${data.location}')">Claim</button>
`;


      list.appendChild(li);
    });
  });

// Claim food
function claimFood(button, destination) {
  // Simple estimated distance (1–10 km)
  const estimatedKm = (Math.random() * 9 + 1).toFixed(1);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const mapUrl =
        `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${encodeURIComponent(destination)}`;

      button.outerHTML = `
        <div style="color: green; font-weight: bold;">
          📏 Estimated Distance: ~${estimatedKm} km<br>
          <a href="${mapUrl}" target="_blank">📍 Open Route in Google Maps</a>
        </div>
      `;
    });
  }
}

//camera
document.getElementById("foodImage").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const img = document.getElementById("preview");
    img.src = URL.createObjectURL(file);
    img.style.display = "block";
  }
});





