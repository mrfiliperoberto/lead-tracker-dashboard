const leads = [
    {
        id: 1, name: "Ana Costa", company: "Company A", email: "ana.costa@empresaA.com", status: "new"
    },
    {
        id: 2, name: "Bruno Silva", company: "Company B", email: "bruno.silva@empresaB.com", status: "contacted"
    },
    {
        id: 3, name: "Carla Santos", company: "Company C", email: "carla.santos@empresaC.com", status: "converted"
    },
    {
        id: 4, name: "Daniel Oliveira", company: "Company D", email: "daniel.oliveira@empresaD.com", status: "new"
    },
    {
        id: 5, name: "Eduardo Lima", company: "Company E", email: "eduardo.lima@empresaE.com", status: "contacted"
    },
    {
        id: 6, name: "Fernanda Rocha", company: "Company F", email: "fernanda.rocha@empresaF.com", status: "converted"
    },
    {
        id: 7, name: "Gabriel Pereira", company: "Company G", email: "gabriel.pereira@empresaG.com", status: "new"
    },
    {
        id: 8, name: "Helena Costa", company: "Company H", email: "helena.costa@empresaH.com", status: "contacted"
    },
    {
        id: 9, name: "Isabela Santos", company: "Company I", email: "isabela.santos@empresaI.com", status: "converted"
    },
    {       
        id: 10, name: "João Silva", company: "Company J", email: "joao.silva@empresaJ.com", status: "new"
    }  
];

// ===== Create lead cards from HTML ====//
function createLeadCard(lead) {
    return `
    <div class="lead-card">
        <div class="lead-header">
            <div>
                <div class="lead-name">${lead.name}</div>
                <div class="lead-company">${lead.company}</div>
            </div>
            <span class="status-badge status-${lead.status}">${lead.status}
            </span>
        </div>
        <div class="lead-info">
            <span>${lead.email}</span>
        </div>
    </div>
    `;
}
// FUNCTION TO RENDER LEADS
function renderLeads(filteredLeads) {
    const grid = document.getElementById("leads-grid");
    //If there are no leads, show a message
    if (filteredLeads.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>No leads found.</p>
      </div>
    `;
    return;
  }
  // map through the filtered leads and create cards for each lead, then join them into a single string and set it as the innerHTML of the grid
    grid.innerHTML = filteredLeads.map(lead => createLeadCard(lead)).join("");

    //update lead count
    updateMetrics(filteredLeads);
}
// FUNCTION TO UPDATE METRICS
function updateMetrics(visibleLeads) {
    document.getElementById("total-count").textContent = visibleLeads.length;
    document.getElementById("contacted-count").textContent = visibleLeads.filter(lead => lead.status === "contacted").length;
    document.getElementById("converted-count").textContent = visibleLeads.filter(lead => lead.status === "converted").length;
}
// INITIAL RENDER
renderLeads(leads);

// SAVES FILTER SELECTIONS AND SEARCH THE ACTIVATED IN THE MOMENT
let currentFilter = "all";
let currentSearch = "";

// FUNCTION TO APPLY FILTERS + SEARCH COMBINED
function applyFilters() {
    let results = leads;
// Filter by status
    if (currentFilter !== "all") {
        results = results.filter(lead => lead.status === currentFilter);
    }
// Filter by search   
 if (currentSearch.trim() !== "") {
    const term = currentSearch.toLowerCase();
    results = results.filter(lead =>
        lead.name.toLowerCase().includes(term) ||
        lead.company.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term)
    );
}   
   renderLeads(results);

 }

 // EVENT: CLICK ON FILTER BUTTONS
 document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        currentFilter = button.getAttribute("data-filter");
        applyFilters();
    });
});
// EVENT type in search input
document.getElementById("search-input").addEventListener("input", (e) => {
    currentSearch = e.target.value;
    applyFilters();
});
// ===== FUNÇÃO: exportar leads como CSV =====
document.getElementById("export-btn")
  .addEventListener("click", () => {

  // 1. Cabeçalho das colunas
  const headers = ["Name", "Company", "Email", "Status"];

  // 2. Cada lead vira uma linha CSV
  const rows = leads.map(lead => [
    lead.name,
    lead.company,
    lead.email,
    lead.status
  ].join(","));

  // 3. Junta cabeçalho + linhas separados por quebra de linha
  const csv = [headers.join(","), ...rows].join("\n");

  // 4. Cria um "arquivo virtual" no navegador
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);

  // 5. Cria um link invisível, clica nele e remove
  const a = document.createElement("a");
  a.href     = url;
  a.download = "leads.csv";
  a.click();
  URL.revokeObjectURL(url);
});
