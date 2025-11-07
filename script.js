// ===== Common variables =====
const inputs = {
  name: document.getElementById("name"),
  purchase: document.getElementById("purchase"),
  sale: document.getElementById("sale"),
  quantity: document.getElementById("quantity"),
  comment: document.getElementById("comment"),
  date: document.getElementById("date"),
};
const addBtn = document.getElementById("addBtn");
const tableBody = document.querySelector("#productTable tbody");
const totalPurchaseCell = document.getElementById("totalPurchase");
const totalProfitCell = document.getElementById("totalProfit");
const totalSaleCell = document.getElementById("totalSale");
const logoutBtn = document.getElementById("logoutBtn");

// Logout
if (logoutBtn){
  logoutBtn.addEventListener("click", ()=>{
    localStorage.removeItem("role");
    window.location.href="index.html";
  });
}

// ===== LocalStorage =====
let products = JSON.parse(localStorage.getItem("products"))||[];
let deleteIndex=null;

// ===== Render Table =====
function renderTable(){
  tableBody.innerHTML="";
  let totalPurchase=0,totalProfit=0,totalSale=0;
  const searchInput=document.getElementById("searchInput");
  let searchValue=searchInput?searchInput.value.toLowerCase():"";
  products.forEach((p,i)=>{
    if(searchValue && !p.name.toLowerCase().includes(searchValue)) return;
    const profit=(p.sale-p.purchase)*p.quantity;
    const purchaseTotal=p.purchase*p.quantity;
    const saleTotal=p.sale*p.quantity;
    totalPurchase+=purchaseTotal;
    totalProfit+=profit;
    totalSale+=saleTotal;

    const role=localStorage.getItem("role");
    if(role==="admin"){
      tableBody.innerHTML+=`<tr>
      <td>${i+1}</td>
      <td>${p.name}</td>
      <td>${p.purchase}</td>
      <td>${p.sale}</td>
      <td>${p.quantity}</td>
      <td>${profit}</td>
      <td>${p.comment}</td>
      <td>${p.date}</td>
      <td><span class="delete-btn" onclick="showDeletePopup(${i})">🗑</span></td>
      </tr>`;
    }else{
      tableBody.innerHTML+=`<tr>
      <td>${i+1}</td>
      <td>${p.name}</td>
      <td>${p.sale}</td>
      <td><button onclick="showDetails(${i})">Details</button></td>
      </tr>`;
    }
  });
  if(totalPurchaseCell) totalPurchaseCell.textContent=`Total Purchase: ${totalPurchase}`;
  if(totalProfitCell) totalProfitCell.textContent=`Total Profit: ${totalProfit}`;
  if(totalSaleCell) totalSaleCell.textContent=`Total Sale: ${totalSale}`;
  localStorage.setItem("products",JSON.stringify(products));
}

// ===== Add Product (Admin) =====
if(localStorage.getItem("role")==="admin"){
  addBtn.addEventListener("click",()=>{
    const name=inputs.name.value.trim();
    const purchase=parseFloat(inputs.purchase.value);
    const sale=parseFloat(inputs.sale.value);
    const quantity=parseInt(inputs.quantity.value);
    const comment=inputs.comment.value.trim();
    const date=inputs.date.value;
    if(!name||isNaN(purchase)||isNaN(sale)||isNaN(quantity)||!date){alert("Please fill all fields correctly!");return;}
    products.push({name,purchase,sale,quantity,comment,date});
    renderTable();
    Object.values(inputs).forEach(i=>i.value="");
  });
}else{
  if(addBtn) addBtn.style.display="none";
  Object.values(inputs).forEach(i=>{if(i)i.style.display="none";});
}

// ===== Search =====
const searchInput=document.getElementById("searchInput");
if(searchInput) searchInput.addEventListener("input",renderTable);

// ===== Delete Popup =====
if(localStorage.getItem("role")==="admin"){
  const popupOverlay=document.getElementById("popupOverlay");
  const confirmDelete=document.getElementById("confirmDelete");
  const cancelDelete=document.getElementById("cancelDelete");
  window.showDeletePopup=function(index){
    deleteIndex=index;
    popupOverlay.classList.remove("hidden");
  };
  confirmDelete.addEventListener("click",()=>{
    if(deleteIndex!==null){products.splice(deleteIndex,1);renderTable();}
    popupOverlay.classList.add("hidden");
  });
  cancelDelete.addEventListener("click",()=>{popupOverlay.classList.add("hidden");});
}else{window.showDeletePopup=function(){}}

// ===== User Details Popup =====
const detailsPopup=document.getElementById("detailsPopup");
const detailsContent=document.getElementById("detailsContent");
const closeDetails=document.getElementById("closeDetails");
window.showDetails=function(i){
  const p=products[i];
  detailsContent.innerHTML=`<p><strong>Name:</strong> ${p.name}</p>
  <p><strong>Purchase Price:</strong> ${p.purchase}</p>
  <p><strong>Sale Price:</strong> ${p.sale}</p>
  <p><strong>Quantity:</strong> ${p.quantity}</p>
  <p><strong>Profit:</strong> ${(p.sale-p.purchase)*p.quantity}</p>
  <p><strong>Comment:</strong> ${p.comment}</p>
  <p><strong>Date:</strong> ${p.date}</p>`;
  detailsPopup.classList.remove("hidden");
};
if(closeDetails) closeDetails.addEventListener("click",()=>{detailsPopup.classList.add("hidden");});

// ===== Initial Render =====
renderTable();

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
      
