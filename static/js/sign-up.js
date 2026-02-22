const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const confirmPass = document.getElementById("confirm-password").value;

  if (pass !== confirmPass) {
    alert("Passwords do not match");
    return;
  }

  const response = await fetch("/logging/signUp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, pass }),
  });

  if (response.ok) {

    window.location.href = "/index.html";
  } else {
    // Other errors → show alert
    const data = await response.json();
    alert(data.error || "Something went wrong");
  }
});
