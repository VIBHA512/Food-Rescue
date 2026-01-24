document.addEventListener("DOMContentLoaded", () => {

  const firebaseConfig = {
    apiKey: "AIzaSyCcTAdHdM_xxzrcT7JFFaPEvNEkwGGapG0",
    authDomain: "food-rescue-1cfc8.firebaseapp.com",
    projectId: "food-rescue-1cfc8",
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
    donorBtn.classList.add("active");
    ngoBtn.classList.remove("active");
  };

  window.showNGO = () => {
    donorSection.classList.add("hidden");
    ngoSection.classList.remove("hidden");
    ngoBtn.classList.add("active");
    donorBtn.classList.remove("active");
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

    alert("Food posted successfully 🎉");
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

        const card = document.createElement("div");
        card.className = "food-card";

        card.innerHTML = `
          <b>${d.food}</b><br/>
          🥗 ${d.foodType}<br/>
          👥 Serves ${d.quantity}<br/>
          ⏰ ${d.pickupTime}<br/>
          📍 ${d.location}<br/>
          👤 Donor: ${d.donorName}
          ${d.image ? `<br/><img src="${d.image}"/>` : ""}
          <div class="food-actions">
            <button class="claim" onclick="claimFood('${doc.id}')">Claim Food</button>
            <a class="map" target="_blank"
              href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.location)}">
              Maps
            </a>
          </div>
        `;

        foodList.appendChild(card);
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
