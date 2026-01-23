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
  const donorNameVal = document.getElementById("donorName")?.value.trim();
  const foodVal = document.getElementById("foodDetails")?.value.trim();
  const locationVal = document.getElementById("location")?.value.trim();

  if (!donorNameVal || !foodVal || !locationVal) {
    alert("Please fill Donor Name, Food Details & Location");
    return;
  }

  db.collection("foods").add({
    donorName: donorNameVal,
    donorType: donorType.value,
    donorPhone: donorPhone.value,
    donorEmail: donorEmail.value,
    food: foodVal,
    quantity: foodQuantity.value,
    foodType: foodType.value,
    pickupTime: pickupTime.value,
    location: locationVal,
    image: imageData,
    claimed: false,
    time: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Food posted successfully 🎉");

  document.querySelectorAll("#donorSection input").forEach(i => i.value = "");
  preview.style.display = "none";
  imageData = "";
};


  // ---------------- NGO VIEW ----------------
db.collection("foods")
  .orderBy("postedAt", "desc")
  .onSnapshot(snapshot => {
    foodList.innerHTML = "";

    snapshot.forEach(doc => {
      const d = doc.data();
      const li = document.createElement("li");

      const mapLink = `
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.location)}"
           target="_blank">🗺 Open Maps</a>
      `;

      if (d.claimed) {
        li.innerHTML = `
          <b>${d.food}</b><br>
          📍 ${d.location}<br>
          ✔ Claimed by ${d.claimedBy}<br>
          🚚 Distance: ${d.distance} km<br>
          ${mapLink}
        `;
      } else {
        li.innerHTML = `
          <b>${d.food}</b><br>
          👥 ${d.quantity}<br>
          ⏰ Pickup: ${d.pickupTime}<br>
          📍 ${d.location}<br>
          ${mapLink}<br><br>
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
