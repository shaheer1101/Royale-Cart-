// ===== Common variables =====
const inputs = {
  name: document.getElementById("name"),
  purchase: document.getElementById("purchase"),
  sale: document.getElementById("sale"),
  comment: document.getElementById("comment"),
  date: document.getElementById("date"),
};
const addBtn = document.getElementById("addBtn");
const tableBody = document.querySelector("#productTable tbody");
const totalPurchaseCell = document.getElementById("totalPurchase");
const totalProfitCell = document.getElementById("totalProfit");
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("role");
    window.location.href = "login.html";
  });
}

// ===== LocalStorage data =====
let products = JSON.parse(localStorage.getItem("products")) || [];
let deleteIndex = null;

// ===== Render table =====
function renderTable() {
  tableBody.innerHTML = "";
  let totalPurchase = 0;
  let totalProfit = 0;

  const searchInput = document.getElementById("searchInput");
  let searchValue = searchInput ? searchInput.value.toLowerCase() : "";

  products.forEach((p, i) => {
    if (searchValue && !p.name.toLowerCase().includes(searchValue)) return;

    const profit = p.sale - p.purchase;
    totalPurchase += p.purchase;
    totalProfit += profit;

    let row = `<tr>
      <td>${p.name}</td>
      <td>${p.purchase}</td>
      <td>${p.sale}</td>
      <td>${profit}</td>
      <td>${p.comment}</td>
      <td>${p.date}</td>`;

    if (localStorage.getItem("role") === "admin") {
      row += `<td><span class="delete-btn" onclick="showDeletePopup(${i})">🗑</span></td>`;
    }
    row += "</tr>";
    tableBody.insertAdjacentHTML("beforeend", row);
  });

  totalPurchaseCell.textContent = `Total Purchase: ${totalPurchase}`;
  totalProfitCell.textContent = `Total Profit: ${totalProfit}`;
  localStorage.setItem("products", JSON.stringify(products));
}

// ===== Add Product (Admin only) =====
if(localStorage.getItem("role") === "admin"){
  addBtn.addEventListener("click", () => {
    const name = inputs.name.value.trim();
    const purchase = parseFloat(inputs.purchase.value);
    const sale = parseFloat(inputs.sale.value);
    const comment = inputs.comment.value.trim();
    const date = inputs.date.value;

    if (!name || isNaN(purchase) || isNaN(sale) || !date) {
      alert("Please fill all fields correctly!");
      return;
    }

    products.push({ name, purchase, sale, comment, date });
    renderTable();

    Object.values(inputs).forEach((i) => (i.value = ""));
  });
} else {
  // User: hide add inputs
  if(addBtn) addBtn.style.display = "none";
  Object.values(inputs).forEach(i => { if(i) i.style.display="none"; });
}

// ===== Search (Admin only) =====
const searchInput = document.getElementById("searchInput");
if (searchInput) searchInput.addEventListener("input", renderTable);

// ===== Delete popup (Admin only) =====
if (localStorage.getItem("role") === "admin") {
  const popupOverlay = document.getElementById("popupOverlay");
  const confirmDelete = document.getElementById("confirmDelete");
  const cancelDelete = document.getElementById("cancelDelete");

  window.showDeletePopup = function (index) {
    deleteIndex = index;
    popupOverlay.classList.remove("hidden");
  };

  confirmDelete.addEventListener("click", () => {
    if (deleteIndex !== null) {
      products.splice(deleteIndex, 1);
      renderTable();
    }
    popupOverlay.classList.add("hidden");
  });

  cancelDelete.addEventListener("click", () => {
    popupOverlay.classList.add("hidden");
  });
} else {
  window.showDeletePopup = function () {};
}

// ===== Initial render =====
renderTable();
      
