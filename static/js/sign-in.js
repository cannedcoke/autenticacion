const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const sessionType = document.getElementById("session-type").value;

  const response = await fetch("/logging/logIn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, pass, sessionType }),
  });
  
  if (response.ok) {
    const data = await response.json();

    if (data.token) {
      sessionStorage.setItem("token", data.token);
    }

    window.location.href = "/dashboard.html";
  } else {
    // Other errors → show alert
    const data = await response.json();
    alert(data.error || "Something went wrong");
  }
});
