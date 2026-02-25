// se ejecuta esta parte al cargarse la pagina
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  document.getElementById("logout-btn").addEventListener("click", logout);
});

// funcion para obtener el token para proteger against csrf
async function getCsrfToken() {
  const res = await fetch("/csrf-token");
  const data = await res.json();
  return data.csrfToken;
}
// genera la tabla con text content para evitar los ataques xxs
function createUserRow(user) {
  const tr = document.createElement("tr");

  const fields = [user.id, user.email, user.role, user.created_at];
  fields.forEach((value) => {
    const td = document.createElement("td");
    td.textContent = value; // safe — never parsed as HTML
    tr.appendChild(td);
  });

  const td = document.createElement("td");
  const btn = document.createElement("button");
  btn.className = "del-btn";
  btn.dataset.id = user.id;
  btn.textContent = "eliminar";
  td.appendChild(btn);
  tr.appendChild(td);

  return tr;
}


// carga el contenido de las tablas basado en su autenticacion y tipo de rol
async function loadDashboard() {
  const token = sessionStorage.getItem("token");
  const csrfToken = token ? null : await getCsrfToken();

  if (token) {
    console.log("Auth type: JWT");
  } else {
    console.log("Auth type: Cookie/Session");
  }

  const response = await fetch("/dashboard/getData", {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(csrfToken && { "x-csrf-token": csrfToken }),
    },
    credentials: "include",
  });

  const data = await response.json();
  const tbody = document.getElementById("users-body");
  tbody.innerHTML = "";

  if (data.role === "admin") {
    data.users.forEach((user) => {
      tbody.appendChild(createUserRow(user));
    });
  } else {
    const user = data.user[0];
    tbody.appendChild(createUserRow(user));
  }
}

// al presionar el boton sale de la sesion y borra los tokens
async function logout() {
  sessionStorage.removeItem("token");

  await fetch("/logging/logout", { method: "POST", credentials: "include" });
  window.location.href = "/index.html";
}

const tbody = document.getElementById("users-body");
tbody.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("del-btn")) return;

  const token = sessionStorage.getItem("token");
  const csrfToken = token ? null : await getCsrfToken();
  const userId = e.target.dataset.id;

  const result = await fetch("/dashboard/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(csrfToken && { "x-csrf-token": csrfToken }),
    },
    credentials: "include",
    body: JSON.stringify({ id: userId }),
  });

  const data = await result.json();

  if (data.alert) {
    alert(data.alert);
    return;
  }

  e.target.closest("tr").remove();
  location.reload();
});
