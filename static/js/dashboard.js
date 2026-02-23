document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

async function loadDashboard() {
  const token = sessionStorage.getItem("token");

  if (token) {
    console.log("Auth type: JWT");
  } else {
    console.log("Auth type: Cookie/Session");
  }

  const response = await fetch("/dashboard/getData", {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
  });

  const data = await response.json();
  const tbody = document.getElementById("users-body");
  tbody.innerHTML = "";

  if (data.role === "admin") {
    data.users.forEach((user) => {
      tbody.innerHTML += `
        <tr>
          <td>${user.id}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${user.created_at}</td>
          <td><button class="del-btn" data-id="${user.id}">eliminar</button></td>
        </tr>
      `;
    });
  } else {
    const user = data.user[0];
    tbody.innerHTML += `
  <tr>
    <td>${user.id}</td>
    <td>${user.email}</td>
    <td>${user.role}</td>
    <td>${user.created_at}</td>
    <td>
 <button class="del-btn" data-id="${user.id}">eliminar</button>
    </td>
  </tr>
`;
  }
}
async function logout() {
  sessionStorage.removeItem("token");
  await fetch("/logging/logout", { method: "POST", credentials: "include" });
  window.location.href = "/index.html";
}
const tbody = document.getElementById("users-body");
tbody.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("del-btn")) return;

  const token = sessionStorage.getItem("token");
  const userId = e.target.dataset.id;

  const result = await fetch("/dashboard/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
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
