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

if(logoutBtn){
  logoutBtn.addEventListener("click",()=>{
    localStorage.removeItem("role");
    window.location.href="index.html";
  });
}

let products = JSON.parse(localStorage.getItem("products"))||[];
let deleteIndex=null;

// Format numbers with commas + currency
function formatNumber(n){
  return "Rs" + n.toLocaleString();
}

// Animate totals
function animateTotal(element, value){
  let start = 0;
  const duration = 300;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = value / steps;
  const interval = setInterval(()=>{
    start += increment;
    if(start >= value){start = value; clearInterval(interval);}
    element.textContent = formatNumber(Math.floor(start));
  }, stepTime);
}

function renderTable(){
  tableBody.innerHTML="";
  let totalPurchase=0,totalProfit=0,totalSale=0;
  const searchInput=document.getElementById("searchInput");
  let searchValue=searchInput?searchInput.value.toLowerCase():"";

  products.forEach((p,i)=>{
    const purchaseTotal = p.purchase * p.quantity;
    const saleTotal = p.sale * p.quantity;
    const profitPerItem = saleTotal - purchaseTotal;
    totalPurchase += purchaseTotal;
    totalSale += saleTotal;
    totalProfit += profitPerItem;

    // Enhanced search: name, comment, date
    if(searchValue && !(
      p.name.toLowerCase().includes(searchValue) || 
      p.comment.toLowerCase().includes(searchValue) || 
      p.date.includes(searchValue)
    )) return;

    const role=localStorage.getItem("role");
    if(role==="admin"){
      tableBody.innerHTML+=`<tr>
        <td>${i+1}</td>
        <td>${p.name}</td>
        <td>${formatNumber(p.purchase)}</td>
        <td>${formatNumber(p.sale)}</td>
        <td>${p.quantity}</td>
        <td>${formatNumber(profitPerItem)}</td>
        <td>${p.comment}</td>
        <td>${p.date}</td>
        <td><span class="delete-btn" onclick="showDeletePopup(${i})">🗑</span></td>
      </tr>`;
    }else{
      tableBody.innerHTML+=`<tr>
        <td>${i+1}</td>
        <td>${p.name}</td>
        <td>${formatNumber(saleTotal)}</td>
        <td><button onclick="showDetails(${i})">Details</button></td>
      </tr>`;
    }
  });

  // Animate totals
  if(totalPurchaseCell) animateTotal(totalPurchaseCell,totalPurchase);
  if(totalSaleCell) animateTotal(totalSaleCell,totalSale);
  if(totalProfitCell) animateTotal(totalProfitCell,totalProfit);

  localStorage.setItem("products",JSON.stringify(products));
}

// Admin: Add product
if(localStorage.getItem("role")==="admin" && addBtn){
  addBtn.addEventListener("click",()=>{
    const name=inputs.name.value.trim();
    const purchase=parseFloat(inputs.purchase.value);
    const sale=parseFloat(inputs.sale.value);
    const quantity=parseInt(inputs.quantity.value);
    const comment=inputs.comment.value.trim();
    const date=inputs.date.value;
    if(!name||isNaN(purchase)||isNaN(sale)||isNaN(quantity)||!date){
      alert("Please fill all fields correctly!");return;
    }
    products.push({name,purchase,sale,quantity,comment,date});
    renderTable();
    Object.values(inputs).forEach(i=>i.value="");
  });
}else{
  if(addBtn) addBtn.style.display="none";
  Object.values(inputs).forEach(i=>{if(i)i.style.display="none";});
}

// Search input
const searchInput=document.getElementById("searchInput");
if(searchInput) searchInput.addEventListener("input",renderTable);

// Delete Popup
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

// Details Popup
const detailsPopup=document.getElementById("detailsPopup");
const detailsContent=document.getElementById("detailsContent");
const closeDetails=document.getElementById("closeDetails");
const popupTotalPurchase=document.getElementById("popupTotalPurchase");
const popupTotalSale=document.getElementById("popupTotalSale");
const popupTotalProfit=document.getElementById("popupTotalProfit");

window.showDetails=function(i){
  const p=products[i];
  popupTotalPurchase.textContent=`Name: ${p.name}`;
  popupTotalSale.textContent=`Purchase: ${formatNumber(p.purchase)}`;
  popupTotalProfit.textContent=`Sale: ${formatNumber(p.sale)}`;

  detailsContent.innerHTML=`
    <div class="detail-box">Quantity: ${p.quantity}</div>
    <div class="detail-box">Profit: ${formatNumber((p.sale-p.purchase)*p.quantity)}</div>
    <div class="detail-box">Comment: ${p.comment} | Date: ${p.date}</div>
  `;

  detailsPopup.classList.remove("hidden");
};

if(closeDetails) closeDetails.addEventListener("click",()=>{detailsPopup.classList.add("hidden");});

renderTable();
                            
