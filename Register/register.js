document.getElementById("registerForm").addEventListener("submit", function(event) {

    function validateEmail(email) {
        // Regular expression to check if the email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    event.preventDefault();

    let fullName = document.getElementById("fullName").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

     if (!validateEmail(email)) {
        alert("Invalid email format.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

     //for checking user is already there in user is its there then show alert
    let users = JSON.parse(localStorage.getItem("users")) || [];

    //for checking email is already there in user if its there then show alert
    if (users.some(user => user.email === email)) {
        alert("User with this email already exists!");
        return;
    }

    let newUser = { fullName, email, password };
    users.push(newUser);


    //for converting to onbject
    localStorage.setItem("users", JSON.stringify(users));

    console.log("Users after registration:", localStorage.getItem("users"));

    alert("Registration successful! You can now log in.");
    window.location.href = "../Login/login.html";
});
