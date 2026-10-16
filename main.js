// ========================================
// 1. DOM Elements
// ========================================

const usersContainer = document.getElementById("usersContainer");

const statusMessage = document.getElementById("statusMessage");

const searchInput = document.getElementById("searchInput");

const searchButton = document.getElementById("searchButton");

const loadButton = document.getElementById("loadButton");


// ========================================
// 2. Application State
// ========================================

let users = [];

let isLoading = false;


// ========================================
// 3. API URL
// ========================================

const API_URL = "https://jsonplaceholder.typicode.com/users";


// ========================================
// 4. Fetch Users with Async/Await
// ========================================

async function fetchUsers() {

    if (isLoading) {
        return;
    }

    try {

        // Start loading

        isLoading = true;

        loadButton.disabled = true;

        searchButton.disabled = true;

        statusMessage.textContent = "Loading users...";

        usersContainer.replaceChildren();


        // Send HTTP request

        const response = await fetch(API_URL);


        // Check HTTP response

        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        // Convert response to JSON

        const data = await response.json();


        // Validate the received data

        if (!Array.isArray(data)) {

            throw new Error(
                "Invalid data received from the server."
            );

        }


        // Save users in application state

        users = data;


        // Render users

        renderUsers(users);


        // Update status message

        statusMessage.textContent =
            `Successfully loaded ${users.length} users.`;


    } catch (error) {

        // Handle errors

        console.error("Failed to fetch users:", error);

        statusMessage.textContent =
            "Failed to load users. Please check your internet connection and try again.";


        // Clear old results

        usersContainer.replaceChildren();


    } finally {

        // Finish loading

        isLoading = false;

        loadButton.disabled = false;

        searchButton.disabled = false;

    }

}




function renderUsers(usersToRender) {

    usersContainer.replaceChildren();


    if (usersToRender.length === 0) {

        statusMessage.textContent = "No users found.";

        return;

    }


    const fragment = document.createDocumentFragment();


    usersToRender.forEach(user => {

        const card = document.createElement("article");

        card.className = "user-card";


        const name = document.createElement("h2");

        name.textContent = user.name;


        const username = document.createElement("p");

        username.textContent = `Username: ${user.username}`;


        const email = document.createElement("p");

        email.textContent = `Email: ${user.email}`;


        const phone = document.createElement("p");

        phone.textContent = `Phone: ${user.phone}`;


        const website = document.createElement("p");

        const websiteLink = document.createElement("a");

        websiteLink.href = getSafeWebsiteUrl(user.website);

        websiteLink.textContent = user.website;

        websiteLink.target = "_blank";

        websiteLink.rel = "noopener noreferrer";

        website.append("Website: ", websiteLink);


        card.append(
            name,
            username,
            email,
            phone,
            website
        );


        fragment.appendChild(card);

    });


    usersContainer.appendChild(fragment);

}



function searchUsers() {

    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();


    const filteredUsers = users.filter(user => {

        return user.name
            .toLowerCase()
            .includes(searchTerm);

    });


    renderUsers(filteredUsers);


    if (filteredUsers.length > 0) {

        statusMessage.textContent =
            `Found ${filteredUsers.length} user(s).`;

    }

}



function getSafeWebsiteUrl(website) {

    try {

        const url = new URL(`https://${website}`);

        if (url.protocol !== "https:") {
            return "#";
        }

        return url.href;

    } catch {

        return "#";

    }

}



loadButton.addEventListener("click", fetchUsers);

searchButton.addEventListener("click", searchUsers);



searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        searchUsers();

    }

});