// 🔥 Firebase Config
document.addEventListener("DOMContentLoaded", function () {

  const firebaseConfig = {
    apiKey: "AIzaSyCcTAdHdM_xxzrcT7JFFaPEvNEkwGGapG0",
    authDomain: "food-rescue-1cfc8.firebaseapp.com",
    projectId: "food-rescue-1cfc8",
    storageBucket: "food-rescue-1cfc8.firebasestorage.app",
    messagingSenderId: "571196450384",
    appId: "1:571196450384:web:5b316891a8a4e65bd79355"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // ---------------- IMAGE HANDLING ----------------
  let imageData = "";

  const foodImage = document.getElementById("foodImage");
  if (foodImage) {
    foodImage.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function () {
        imageData = reader.result;
        const preview = document.getElementById("preview");
        preview.src = imageData;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }

  // ---------------- VIEW SWITCH ----------------
  window.showDonor = function () {
    document.getElementById("donorSection").style.display = "block";
    document.getElementById("ngoSection").style.display = "none";
  };

  window.showNGO = function () {
    document.getElementById("donorSection").style.display = "none";
    document.getElementById("ngoSection").style.display = "block";
  };

  // ---------------- TIME HELPERS ----------------
  function getRemainingTime(expiresAt) {
    const diff = expiresAt - Date.now();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }

  // ---------------- POST FOOD ----------------
  window.postFood = function () {
    const name = document.getElementById("donorName").value;
    const food = document.getElementById("foodDetails").value;
    const location = document.getElementById("location").value;

    if (!name || !food || !location) {
      alert("Please fill all fields");
      return;
    }

    const now = Date.now();
    const expiresAt = now + (5 * 60 * 60 * 1000); // 5 hours

    db.collection("foods").add({
      donor: name,
      food: food,
      location: location,
      image: imageData,
      claimed: false,
      postedAt: now,
      expiresAt: expiresAt
    });

    alert("Food posted! Valid for 5 hours ⏳");

    document.getElementById("donorName").value = "";
    document.getElementById("foodDetails").value = "";
    document.getElementById("location").value = "";
    document.getElementById("preview").style.display = "none";
    imageData = "";
  };

  // ---------------- NGO VIEW ----------------
  let firstLoad = true;

  db.collection("foods")
    .orderBy("postedAt", "desc")
    .onSnapshot(snapshot => {

      const list = document.getElementById("foodList");
      const alertBox = document.getElementById("alertBox");

      list.innerHTML = "";

      if (!firstLoad && alertBox) {
        alertBox.style.display = "block";
        setTimeout(() => alertBox.style.display = "none", 4000);
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");

        let timeLeft = "Unknown";
        let isExpired = false;

        if (data.expiresAt) {
          timeLeft = getRemainingTime(data.expiresAt);
          isExpired = timeLeft === "Expired";
        }

        // 🟥 EXPIRED
        if (isExpired) {
          li.innerHTML = `
            <b>${data.food}</b><br>
            📍 ${data.location}<br>
            <span style="color:red; font-weight:bold;">
              ⏰ Time Expired
            </span>
          `;
        }

        // 🟩 CLAIMED
        else if (data.claimed) {
          li.innerHTML = `
            <b>${data.food}</b><br>
            📍 ${data.location}<br>
            ✔ Claimed by NGO: ${data.claimedBy}<br>
            🚚 Distance: ${data.distance} km<br>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location)}"
               target="_blank">🗺 Open in Maps</a>
          `;
        }

        // 🟨 AVAILABLE
        else {
          li.innerHTML = `
            <b>${data.food}</b><br>
            📍 ${data.location}<br>
            by ${data.donor}<br>
            <span style="color:orange; font-weight:bold;">
              ⏳ Expires in: ${timeLeft}
            </span><br>
            ${data.image ? `<img src="${data.image}" width="120"><br>` : ""}
            <button onclick="claimFood('${doc.id}')">Claim</button>
          `;
        }

        list.appendChild(li);
      });

      firstLoad = false;
    });

  // ---------------- CLAIM FOOD ----------------
  window.claimFood = function (docId) {
    const ngoName = document.getElementById("ngoName").value;

    if (!ngoName) {
      alert("Please enter NGO name first");
      return;
    }

    const distance = (Math.random() * 8 + 1).toFixed(1);

    db.collection("foods").doc(docId).update({
      claimed: true,
      claimedBy: ngoName,
      distance: distance
    });
  };

});
