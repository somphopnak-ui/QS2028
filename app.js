(() => {
  const data = window.dashboardData;
  const totals = data.faculties.reduce((sum, row) => ({ ar: sum.ar + row.ar, er: sum.er + row.er }), { ar: 0, er: 0 });
  const number = new Intl.NumberFormat("th-TH");
  const maxCampusTotal = Math.max(...data.campuses.map((row) => row.ar + row.er));

  document.querySelector("#arTotal").textContent = number.format(totals.ar);
  document.querySelector("#erTotal").textContent = number.format(totals.er);
  document.querySelector("#totalCount").textContent = number.format(totals.ar + totals.er);
  document.querySelector("#campusCount").textContent = number.format(data.campuses.length);
  document.querySelector("#updatedAt").textContent = data.updatedAt;

  document.querySelector("#campusBars").innerHTML = data.campuses.map((row) => {
    const total = row.ar + row.er;
    const totalWidth = (total / maxCampusTotal) * 100;
    const arWidth = total ? (row.ar / total) * totalWidth : 0;
    const erWidth = total ? (row.er / total) * totalWidth : 0;
    return `<div class="campus-row"><div class="campus-name">${row.campus}</div><div class="bar-track" aria-label="${row.campus} รวม ${total} รายชื่อ"><div class="bar bar--ar" style="width:${arWidth}%">${row.ar ? `<em>AR ${number.format(row.ar)}</em>` : ""}</div><div class="bar bar--er" style="width:${erWidth}%">${row.er ? `<em>ER ${number.format(row.er)}</em>` : ""}</div></div><div class="row-total">${number.format(total)}</div></div>`;
  }).join("");

  const filters = ["ทั้งหมด", ...data.campuses.map((row) => row.campus)];
  const filtersRoot = document.querySelector("#filters");
  filtersRoot.innerHTML = filters.map((filter, index) => `<button class="filter" type="button" data-campus="${filter}" aria-pressed="${index === 0}">${filter}</button>`).join("");

  const renderTable = (campus = "ทั้งหมด") => {
    const rows = data.faculties.filter((row) => campus === "ทั้งหมด" || row.campus === campus);
    document.querySelector("#facultyRows").innerHTML = rows.map((row) => `<tr><td>${row.campus}</td><td>${row.faculty}</td><td>${number.format(row.ar)}</td><td>${number.format(row.er)}</td><td>${number.format(row.ar + row.er)}</td></tr>`).join("");
  };
  renderTable();
  filtersRoot.addEventListener("click", (event) => {
    const button = event.target.closest(".filter");
    if (!button) return;
    filtersRoot.querySelectorAll(".filter").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    renderTable(button.dataset.campus);
  });
})();
