chrome.tabs.executeScript({ file: 'jquery.min.js' });

let username = '';

chrome.storage.sync.get('username', (result) => {
  username = result.username;
  document.getElementById('username').innerHTML = `${result.username}'s Repositories`;
  getRepos(result.username);
});

const modal = document.getElementById('myModal');

const closeButton = document.getElementsByClassName('close')[0];

const oAuthToken = '';

const headers = {
  Authorization: `Token ${oAuthToken}`,
};

const buttons = document.getElementsByClassName('card-button');

class Card {
  constructor(repositoryName, repositoryLink, commitTotal, topLanguage, cardContainer) {
    this.repositoryName = repositoryName;
    this.repositoryLink = repositoryLink;
    this.commitTotal = commitTotal;
    this.topLanguage = topLanguage;
    this.cardContainer = cardContainer;
  }

  createCard() {
    if (this.repositoryName.length > 20) {
      this.repositoryName = this.repositoryName.substr(0, 20) + '...';
    }

    const cardContainer = document.createElement('div');
    cardContainer.className = 'card';

    cardContainer.innerHTML = `<div class="card-text-section">
                                  <div class="card-title">
                                    <a href="${this.repositoryLink}" target="_blank">${this.repositoryName}</a>
                                  </div>
                                </div>
                                <div class="card-text-section">
                                  <div class="main-text">Commits: ${this.commitTotal}</div>
                                  <div class="main-text">Top Language: ${this.topLanguage}</div>
                                </div>
                                <div class="card-actions">
                                  <div class="card-button">
                                    <span class="label" id="${this.repositoryName}">View Commit Messages</span>
                                  </div>
                                </div>`;

    this.cardContainer = cardContainer;
  }
}

document.body.onclick = (ev) => {
  if (ev.target.getAttribute('class') === 'label') {
    chrome.storage.sync.get('username', (result) => {
      getAllCommitMessages(ev.srcElement.id, result.username, 1);
    });
  }
};

closeButton.onclick = () => {
  modal.style.display = 'none';
  document.querySelectorAll('.message-title').forEach((element) => element.remove());
  document.getElementById('list-title').innerHTML = '';
};

/**
 * @param {JSON} userData - JSON result of all repositories for the user
 * @param {string} username - GitHub username
 * Creates cards containing total commits and top langauge
 */
async function createCompleteOverview(userData, username) {
  let isNewPage = false;
  let rowElements = '';
  try {
    rowElements = document.getElementsByClassName('row')[0].childElementCount;
  } catch (error) {
    isNewPage = true;
  }

  let newRow = '';

  if (rowElements === 4 || isNewPage) {
    newRow = document.createElement('div');
    newRow.className = 'row';
    $(newRow).insertAfter('.row:last');
  }

  for (repo of userData) {
    const totalCommits = await getAllCommits(repo.name, username, 1);

    let repositoryCard = new Card(repo.name, repo.html_url, totalCommits, repo.language);

    repositoryCard.createCard();

    let totalRows = document.getElementsByClassName('row').length;

    let lastRowCardCount = 0;

    let newRow = document.createElement('div');
    newRow.className = 'row';

    if (totalRows !== 0) {
      lastRowCardCount = document.getElementsByClassName('row')[totalRows - 1].childElementCount;
    } else if (totalRows === 0) {
      $(newRow).appendTo('#content');
    }

    // if the row is full
    if (lastRowCardCount === 4) {
      $(newRow).insertAfter('.row:last');
    }

    $('.row:last').append(repositoryCard.cardContainer);
  }
}

/**
 * @param {string} username - GitHub username
 * Uses GitHub API to view programming languages for user
 */
async function getRepos(username) {
  const url = `https://api.github.com/users/${username}/repos`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Token ${oAuthToken}`,
    },
  });

  const result = await response.json();

  createCompleteOverview(result, username);
}

/**
 * Function name: getAllCommits(
 * @param {string} repositoryName - GitHub repository
 * @param {string} username - GitHub username
 * @param {int} page - Current page in api pagination
 * Returns all commits for each repository for a certain user
 */
async function getAllCommits(repositoryName, username, page) {
  const commitUrl = `https://api.github.com/repos/${username}/${repositoryName}/commits?page=${page}&per_page=100`;

  const commitResponse = await fetch(commitUrl, {
    method: 'GET',
    headers: headers,
  });

  const commitResult = await commitResponse.json();

  let totalCommits = commitResult.length;

  if (totalCommits % 100 === 0) {
    totalCommits += await getAllCommits(repositoryName, username, page + 1);
  }

  return totalCommits;
}

/**
 * Function name: getAllLanguages
 * @param {string} repositoryName - GitHub repository
 * @param {string} username - GitHub username
 * returns object of languages for specific repository
 */
async function getAllLanguages(repository, username) {
  const languageUrl = `https://api.github.com/repos/${username}/${repository}/languages`;

  const result = await fetch(languageUrl, {
    method: 'GET',
    headers: headers,
  });

  const langaugeData = await result.json();

  return langaugeData;
}

/**
 * Function name: getAllCommitMessages
 * @param {string} repositoryName - GitHub repository
 * @param {string} username - GitHub username
 * returns object of languages for specific repository
 */
async function getAllCommitMessages(repository, username, page) {
  const commitsUrl = `https://api.github.com/repos/${username}/${repository}/commits?page=${page}&per_page=100`;

  const result = await fetch(commitsUrl, {
    method: 'GET',
    headers: headers,
  });

  const commits = await result.json();

  document.getElementById('list-title').innerHTML = `Commit Message Titles For: ${repository}`;

  if (commits.length !== 0) {
    commits.forEach((commit) => {
      console.log(commit);
      if (commit.author.login === username && commit.author.login !== undefined) {
        const innerContainer = document.getElementsByClassName('modal-content')[0];

        const messageContainer = document.createElement('p');
        messageContainer.className = 'message-title';
        messageContainer.appendChild(
          document.createTextNode(
            commit.commit.message + ' created at: ' + commit.commit.author.date
          )
        );
        innerContainer.appendChild(messageContainer);
      }
    });

    modal.style.display = 'block';

    getAllCommitMessages(repository, username, page + 1);
  }
}
