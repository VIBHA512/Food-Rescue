let foods = [];

function postFood() {
  const donor = document.getElementById("donorName").value;
  const food = document.getElementById("foodName").value;
  const location = document.getElementById("location").value;

  if (donor === "" || food === "" || location === "") {
    alert("Please fill all fields");
    return;
  }

  foods.push({
    donor,
    food,
    location,
    claimed: false
  });

  displayFood();

  document.getElementById("donorName").value = "";
  document.getElementById("foodName").value = "";
  document.getElementById("location").value = "";
}

function displayFood() {
  const foodList = document.getElementById("foodList");
  foodList.innerHTML = "";

  foods.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <b>${item.food}</b> | ${item.location} | by ${item.donor}
      <br>
      ${
        item.claimed
          ? "<span style='color:green;'>✔ Claimed</span>"
          : `<button onclick="claimFood(${index})">Claim Food</button>`
      }
    `;

    foodList.appendChild(li);
  });
}

function claimFood(index) {
  foods[index].claimed = true;
  displayFood();
}
