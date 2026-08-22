const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const message = document.getElementById("message");


// Show / Hide Password
togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }

});


// Login Form
loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = passwordInput.value;

    if (email === "" || password === "") {
        message.textContent = "Please fill all fields.";
        message.style.color = "red";
        return;
    }

    // Temporary frontend login
    console.log("Email:", email);
    console.log("Password:", password);

    message.textContent = "Login successful!";
    message.style.color = "green";

});
