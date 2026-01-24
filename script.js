document.addEventListener("DOMContentLoaded", () => {

  const firebaseConfig = {
    apiKey: "AIzaSyCcTAdHdM_xxzrcT7JFFaPEvNEkwGGapG0",
    authDomain: "food-rescue-1cfc8.firebaseapp.com",
    projectId: "food-rescue-1cfc8",
    storageBucket: "food-rescue-1cfc8.appspot.com",
    messagingSenderId: "571196450384",
    appId: "1:571196450384:web:5b316891a8a4e65bd79355"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  let imageData = "";
  const foodImage = document.getElementById("foodImage");
  const preview = document.getElementById("preview");

  foodImage.addEventListener("change", () => {
    const reader = new FileReader();
    reader.onload = () => {
      imageData = reader.result;
      preview.src = imageData;
      preview.style.display = "block";
    };
    reader.readAsDataURL(foodImage.files[0]);
  });

  window.showDonor = () => {
    donorSection.classList.remove("hidden");
    ngoSection.classList.add("hidden");
  };

  window.showNGO = () => {
    donorSection.classList.add("hidden");
    ngoSection.classList.remove("hidden");
  };

  window.postFood = () => {
    if (!donorName.value || !foodDetails.value || !location.value) {
      alert("Please fill required fields");
      return;
    }

    db.collection("foods").add({
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
      postedAt: Date.now()
    });

    alert("Food Posted Successfully 🎉");
    document.querySelectorAll("input").forEach(i => i.value = "");
    preview.style.display = "none";
    imageData = "";
  };

  db.collection("foods").orderBy("postedAt", "desc")
    .onSnapshot(snapshot => {
      foodList.innerHTML = "";
      snapshot.forEach(doc => {
        const d = doc.data();
        if (d.claimed) return;

        const li = document.createElement("li");
        li.innerHTML = `
          <b>${d.food}</b><br>
          🍱 ${d.foodType}<br>
          👥 ${d.quantity}<br>
          ⏰ ${d.pickupTime}<br>
          📍 ${d.location}<br>
          ${d.image ? `<img src="${d.image}">` : ""}
          <br>
          <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.location)}">📍 Open Map</a>
          <br>
          <button onclick="claimFood('${doc.id}')">Claim</button>
        `;
        foodList.appendChild(li);
      });
    });

  window.claimFood = (id) => {
    if (!ngoName.value) {
      alert("Enter NGO Name first");
      return;
    }

    db.collection("foods").doc(id).update({
      claimed: true,
      claimedBy: ngoName.value
    });
  };

});
