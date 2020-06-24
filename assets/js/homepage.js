var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make request to the url 
    fetch(apiUrl)
    .then(function(response) {

        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to GitHub")
    })
}

// to performed on click when user searches github username
var formSubmitHandler = function (event) {
    event.preventDefault();
    // gets username that was submitted in the form
    var username = nameInputEl.value.trim();

    // if username was not left blank
    if (username) {
        // perform function to fetch repos for that specific user
        getUserRepos(username);
        // clear out form
        nameInputEl.value = "";
        // if no username was entered, alert user to add in a username
    } else {
        alert("Please enter a GitHub username");
    }
};

var displayRepos = function (repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0 ) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    
    // clear out form
    repoContainerEl.textContent="";
    repoSearchTerm.textContent= searchTerm;

    // loop over repos
    for (var i=0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo 
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName; 

        // append to container
        repoEl.appendChild(titleEl);

        // create status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class= 'fas fa-check-square status-icon icon-success'></i>"
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
}



userFormEl.addEventListener("submit", formSubmitHandler);