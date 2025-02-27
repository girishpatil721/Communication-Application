const uploadForm = document.getElementById("uploadForm");
const myUploadsList = document.getElementById("myUploadsList");

function displayFullname() {
    debugger
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        document.getElementById("loggedInUserName").textContent = `Logged in as: ${loggedInUser.fullName}`;
    } else {
        window.location.href = "./welcomePage.html";
    }
}

function getUploads() {
    return JSON.parse(localStorage.getItem("uploads")) || [];
}

function saveUploads(uploads) {
    localStorage.setItem("uploads", JSON.stringify(uploads));
}

function getCurrentUser() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    return user ? user.fullName : "Unknown User";
}

function getCurrentUseremail() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    return user ? user.email : "Unknown User";
}

function loadUploads() {
    myUploadsList.innerHTML = "";
    const uploads = getUploads();
    const currentUser = getCurrentUser();

    uploads.forEach((upload, index) => {
        if (upload.uploadedBy === currentUser) {
            const row = document.createElement("tr");
            row.innerHTML = `
                    <td>${upload.label}</td>
                    <td>${upload.fileName}</td>
                    <td>${upload.uploadedBy}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editUpload(${index})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteFile(${index}, 'upload')">Delete</button>
                        <button class="btn btn-danger btn-sm" onclick="sharedUpload(${index})">share</button>
                    </td>
                `;
            myUploadsList.appendChild(row);
        }
    });
}

uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    debugger
    const fileLabel = document.getElementById("fileLabel").value;
    const fileInput = document.getElementById("fileInput").files[0];

    if (!fileInput) {
        alert("Please select a file.");
        return;
    }

    const fileName = fileInput.name;
    const uploadedBy = getCurrentUser();
    const userEmail = getCurrentUseremail();

    const newUpload = { label: fileLabel, fileName, uploadedBy, userEmail };
    const uploads = getUploads();
    uploads.push(newUpload);
    saveUploads(uploads);

    uploadForm.reset();
    loadUploads();
});

function editUpload(index) {
    const uploads = getUploads();
    const upload = uploads[index];

    const newLabel = prompt("Edit label:", upload.label);
    if (newLabel) {
        uploads[index].label = newLabel;
        saveUploads(uploads);
        loadUploads();
    }
}

function deleteFile(index, type) {
    if (confirm("Are you sure you want to delete this file?")) {
        if (type === "upload") {
            const uploads = getUploads();
            uploads.splice(index, 1);
            saveUploads(uploads);
            loadUploads();
        } else if (type === "shared") {
            const sharedUploads = getSharedUploads();
            sharedUploads.splice(index, 1);
            saveSharedUploads(sharedUploads);
            loadSharedUploads();
        }
    }
}


// for Shared Folder JS code
function getSharedUploads() {
    return JSON.parse(localStorage.getItem("sharedUploads")) || [];
}

function saveSharedUploads(sharedUploads) {
    localStorage.setItem("sharedUploads", JSON.stringify(sharedUploads));
}

function sharedUpload(index) {
    if (confirm("Are you sure you want to share this file?")) {
        const availableUser = JSON.parse(localStorage.getItem("users")) || []
        const currentUser = getCurrentUser();

        if (availableUser.length === 0) {
            alert("No users available to share with.");
            return;
        }

        // Create a dropdown for user selection
        let userSelect = document.createElement("select");
        userSelect.id = "userSelect";
        availableUser.forEach(user => {
            if (user.fullName !== currentUser) {
                let option = document.createElement("option");
                option.value = user.fullName; // Assuming 'username' is the key
                option.textContent = user.fullName; // Assuming 'fullName' is stored
                userSelect.appendChild(option);
            }
        });

        // Create a modal for user selection
        let modal = document.createElement("div");
        modal.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
            <h3>Select a user to share with:</h3>
            ${userSelect.outerHTML}
            <button id="confirmShare">Share</button>
            <button id="cancelShare">Cancel</button>
        </div>`;
        modal.id = "shareModal";
        document.body.appendChild(modal);

        document.getElementById("confirmShare").addEventListener("click", function () {
            const selectedUser = document.getElementById("userSelect").value;

            if (!selectedUser) {
                alert("Please select a user.");
                return;
            }
            const uploads = getUploads();
            const sharedUploads = getSharedUploads();
            // Get the selected file
            const upload = uploads[index];
            // Add it to shared uploads
            sharedUploads.push({ ...upload, sharedwith: selectedUser });
            saveSharedUploads(sharedUploads);
            loadSharedUploads();
            alert(`File shared with ${selectedUser}`);
        });


        // Handle cancel action
        document.getElementById("cancelShare").addEventListener("click", function () {
            document.body.removeChild(modal);
        });
    }
}

function loadSharedUploads() {
    const sharedUploadsList = document.getElementById("sharedUploadsList");
    sharedUploadsList.innerHTML = "";
    const sharedUploads = getSharedUploads();
    const currentUser = getCurrentUser();

    sharedUploads.forEach((upload, index) => {
        if (upload.uploadedBy === currentUser || (upload.sharedwith && upload.sharedwith.includes(currentUser)) ) {
            const row = document.createElement("tr");
            row.innerHTML = `
                    <td>${upload.label}</td>
                    <td>${upload.fileName}</td>
                    <td>${upload.uploadedBy}</td>
                    <td>${upload.sharedwith}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteFile(${index}, 'shared')">Delete</button>
                    </td>
                `;
            sharedUploadsList.appendChild(row);
        }
    });
}

// Call `loadSharedUploads()` on page load
document.addEventListener("DOMContentLoaded", () => {
    displayFullname();
    loadUploads();
    loadSharedUploads();
});

// Logout function
function logout() {
    localStorage.removeItem("loggedInUser"); // Clear logged-in user data
    window.location.href = "../Login/login.html"; // Redirect to login page
}