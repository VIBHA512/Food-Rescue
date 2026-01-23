document.addEventListener("DOMContentLoaded", function () {

  // 🔥 Firebase Config
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

  // ---------------- IMAGE ----------------
  let imageData = "";

  document.getElementById("foodImage").addEventListener("change", function () {
    const reader = new FileReader();
    reader.onload = () => {
      imageData = reader.result;
      document.getElementById("preview").src = imageData;
      document.getElementById("preview").style.display = "block";
    };
    reader.readAsDataURL(this.files[0]);
  });

  // ---------------- VIEW SWITCH ----------------
  window.showDonor = () => {
    donorSection.style.display = "block";
    ngoSection.style.display = "none";
  };

  window.showNGO = () => {
    donorSection.style.display = "none";
    ngoSection.style.display = "block";
  };

  // ---------------- POST FOOD ----------------
  window.postFood = function () {
    const data = {
      donorName: donorName.value,
      donorType: donorType.value,
      donorPhone: donorPhone.value,
      donorEmail: donorEmail.value,
      food: foodDetails.value,
      quantity: foodQuantity.value,
      foodType: foodType.value,
      pickupTime: pickupTime.value,
      location: location.value,
      image: imageData,
      claimed: false,
      time: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!data.donorName || !data.food || !data.location) {
      alert("Please fill required fields");
      return;
    }

    db.collection("foods").add(data);
    alert("Food posted successfully!");

    document.querySelectorAll("input").forEach(i => i.value = "");
    preview.style.display = "none";
    imageData = "";
  };

  // ---------------- NGO VIEW ----------------
  db.collection("foods").orderBy("time", "desc")
    .onSnapshot(snapshot => {
      foodList.innerHTML = "";

      snapshot.forEach(doc => {
        const d = doc.data();
        const li = document.createElement("li");

        if (d.claimed) {
          li.innerHTML = `
            <b>${d.food}</b><br>
            📍 ${d.location}<br>
            ✔ Claimed by ${d.claimedBy}<br>
            🚚 Distance: ${d.distance} km
          `;
        } else {
          li.innerHTML = `
            <b>${d.food}</b><br>
            👥 ${d.quantity}<br>
            🕒 ${d.pickupTime}<br>
            📍 ${d.location}<br>
            🏢 ${d.donorType}<br>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.location)}"
              target="_blank">🗺 Open Maps</a><br><br>
            <button onclick="claimFood('${doc.id}')">Claim</button>
          `;
        }

        foodList.appendChild(li);
      });
    });

  // ---------------- CLAIM FOOD ----------------
  window.claimFood = function (docId) {
    const ngo = ngoName.value;
    if (!ngo) {
      alert("Enter NGO Name first");
      return;
    }

    const distance = (Math.random() * 8 + 1).toFixed(1);

    db.collection("foods").doc(docId).update({
      claimed: true,
      claimedBy: ngo,
      distance: distance
    });
  };

});
