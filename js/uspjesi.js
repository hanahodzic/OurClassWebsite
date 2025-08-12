
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getDatabase, ref,
  onValue, push
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://webpage-bd792-default-rtdb.europe-west1.firebasedatabase.app"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


const listEl     = document.getElementById("achievementList");
const searchIn   = document.getElementById("searchInput");
const sortBtn    = document.getElementById("sortBtn");
const modal      = document.getElementById("modal");
const modalClose = modal.querySelector(".close-btn");
const modalBody  = modal.querySelector(".modal-content p");
const form       = document.getElementById("addSuccessForm");
let studentsData = {};
let sortAsc = true;


function renderList(dataObj) {
  listEl.innerHTML = "";
  const names = Object.keys(dataObj).sort((a,b)=>
    sortAsc
      ? a.localeCompare(b)
      : b.localeCompare(a)
  );
  names.forEach(name => {
    const achs = dataObj[name];
    const desc = achs
      .map(a => {
        if (a.place !== undefined) {
          const s = a.season ? ` ${a.season}` : "";
          return `${a.place}. mjesto ${a.event}${s}`;
        }
        return a.event;
      })
      .join(" • ");
    const li = document.createElement("li");
    li.textContent = `${name}: ${desc}`;
    li.dataset.name = name.toLowerCase();
    li.addEventListener("click", ()=> openModal(name, achs));
    listEl.appendChild(li);
  });
}

function openModal(name, achs) {
  modalBody.innerHTML = `<strong>${name}</strong><br>` +
    "<ul>" +
      achs.map(a => {
        if (a.place !== undefined) {
          const s = a.season ? ` ${a.season}` : "";
          return `<li>${a.place}. mjesto ${a.event}${s}</li>`;
        }
        return `<li>${a.event}</li>`;
      }).join("") +
    "</ul>";
  modal.style.display = "block";
}
modalClose.addEventListener("click", ()=> modal.style.display = "none");
window.addEventListener("click", e=>{
  if (e.target === modal) modal.style.display = "none";
});


searchIn.addEventListener("input", ()=>{
  const q = searchIn.value.toLowerCase();
  listEl.querySelectorAll("li").forEach(li=>{
    li.style.display = li.dataset.name.includes(q) ? "" : "none";
  });
});
sortBtn.addEventListener("click", ()=>{
  sortAsc = !sortAsc;
  renderList(studentsData);
});


onValue(ref(db, 'students'), snap => {
  const val = snap.val() || {};
  studentsData = Object.fromEntries(
    Object.entries(val).map(([name, arrOrObj])=>{
      const arr = Array.isArray(arrOrObj)
        ? arrOrObj.filter(Boolean)
        : Object.values(arrOrObj);
      return [ name, arr ];
    })
  );
  renderList(studentsData);
});


form.addEventListener("submit", e=>{
  e.preventDefault();
  const name = form[0].value.trim();
  const desc = form[1].value.trim();
  if (!name || !desc) return;

  push(ref(db, `students/${name}`), {
    event: desc
  }).then(()=>{
    form.reset();
  });
});
