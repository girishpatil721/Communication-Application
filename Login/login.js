function validateEmail(email) {
    // Regular expression to check if the email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();

    if (!validateEmail(email)) {
        alert("Invalid email format.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log("Stored users:", users); // Debugging

    const user = users.find(user => user.email.toLowerCase() === email && user.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        
        alert("Login successful! Welcome.");
        window.location.href = '../welcome/welcomePage.html';
    } else {
        alert("Wrong Email or Password.");
    }
});
