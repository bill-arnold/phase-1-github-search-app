document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
  
      // Check if the search term is empty
      if (!searchTerm) {
        alert('Please enter a search term.');
        return;
      }
  
      // Clear previous search results
      userList.innerHTML = '';
      reposList.innerHTML = '';
  
      // Perform user search using the GitHub API
      searchUsers(searchTerm)
        .then(users => {
          displayUsers(users);
        })
        .catch(error => {
          console.error('Error searching for users:', error);
          alert('An error occurred while searching for users. Please try again.');
        });
    });
  
    // Function to perform user search using the GitHub API
    function searchUsers(username) {
      const url = `https://api.github.com/search/users?q=${username}`;
      return fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => data.items); // Extract the items array from the response
    }
  
    // Function to display user search results
    function displayUsers(users) {
      users.forEach(user => {
        const listItem = document.createElement('li');
        const avatar = document.createElement('img');
        const usernameLink = document.createElement('a');
  
        avatar.src = user.avatar_url;
        avatar.alt = `${user.login}'s avatar`;
        usernameLink.href = user.html_url;
        usernameLink.textContent = user.login;
  
        listItem.appendChild(avatar);
        listItem.appendChild(usernameLink);
  
        // Add click event listener to each user item
        listItem.addEventListener('click', function () {
          displayUserRepos(user.login);
        });
  
        userList.appendChild(listItem);
      });
    }
  
    // Function to fetch and display user repositories
    function displayUserRepos(username) {
      const url = `https://api.github.com/users/${username}/repos`;
      fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(repos => {
          reposList.innerHTML = '';
          repos.forEach(repo => {
            const listItem = document.createElement('li');
            listItem.textContent = repo.name;
            reposList.appendChild(listItem);
          });
        })
        .catch(error => {
          console.error('Error fetching user repositories:', error);
          alert('An error occurred while fetching user repositories. Please try again.');
        });
    }
  });
  