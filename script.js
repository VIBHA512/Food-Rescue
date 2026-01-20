function showDonor() {
  document.getElementById("donorSection").style.display = "block";
  document.getElementById("ngoSection").style.display = "none";
}

function showNGO() {
  document.getElementById("donorSection").style.display = "none";
  document.getElementById("ngoSection").style.display = "block";
}

function postFood() {
  const name = document.getElementById("donorName").value;
  const food = document.getElementById("foodDetails").value;
  const location = document.getElementById("location").value;

  if (!name || !food || !location) {
    alert("Please fill all fields");
    return;
  }

  const li = document.createElement("li");
  li.innerHTML = `${food} | ${location} | by ${name} 
    <button onclick="this.parentElement.remove()">Claim</button>`;

  document.getElementById("foodList").appendChild(li);

  alert("Food posted successfully!");
}
