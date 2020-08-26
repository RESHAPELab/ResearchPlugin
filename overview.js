class Card {
  constructor(
    repositoryName,
    repositoryLink,
    commitTotal,
    topLanguage,
    languageColor,
    cardContainer
  ) {
    this.repositoryName = repositoryName;
    this.repositoryLink = repositoryLink;
    this.commitTotal = commitTotal;
    this.topLanguage = topLanguage;
    this.languageColor = languageColor;
    this.cardContainer = cardContainer;
  }

  createCard(username) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card';

    cardContainer.innerHTML = `<div class="card-text-section">
                                  <div class="card-title">
                                    <a href="${this.repositoryLink}" target="_blank"><svg class="octicon octicon-repo mr-2 text-gray flex-shrink-0" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg> ${username}/${this.repositoryName}</a>
                                  </div>
                                </div>
                                <div class="card-text-section">
                                  <div class="main-text">
                                    <svg text="gray" height="16" class="octicon octicon-history text-gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"></path></svg>
                                    Commits: ${this.commitTotal}</div>`;

    if (this.topLanguage !== null) {
      cardContainer.innerHTML += `
                                  <div class="card-language-section">
                                    <span class="repo-language-color" style="background-color: ${this.languageColor}"></span>
                                    <div class="main-text top-language"> ${this.topLanguage}</div>
                                  </div>`;
    }

    cardContainer.innerHTML += `            
                                </div>
                                <div class="card-actions">
                                  <div class="card-button">
                                    <span class="label" id="${this.repositoryName}">View Commit Messages/Issues</span>
                                  </div>
                                </div>`;

    this.cardContainer = cardContainer;
  }
}

chrome.storage.sync.get('username', (result) => {
  document.getElementById(
    'username'
  ).innerHTML = `<a href="https://github.com/${result.username}" target="_blank"><svg aria-label="forks" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="24" height="24" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg> ${result.username}/<span class="text-gray-dark ">Repositories</span></a>`;
  getRepos(result.username);
});

document.body.onclick = (ev) => {
  if (ev.target.getAttribute('class') === 'label') {
    chrome.storage.sync.get('username', (result) => {
      const FIRST_PAGE = 1;
      getAllCommitMessages(ev.srcElement.id, result.username, FIRST_PAGE);
      updateTotalIssues(ev.srcElement.id, result.username, FIRST_PAGE);
    });
  }
};

document.getElementsByClassName('close')[0].onclick = () => {
  document.getElementById('modalContainer').style.display = 'none';
  document.querySelectorAll('.message-title').forEach((element) => element.remove());
  document.getElementById('current-repository').innerHTML = '';
};

/**
 * Function name: createCompleteOverview
 * @param {JSON} userData - JSON result of all repositories for the user
 * @param {string} username - GitHub username
 * Creates cards containing total commits and top langauge
 */
async function createCompleteOverview(userData, username) {
  const FIRST_PAGE = 1;
  const MAX_CARDS_PER_ROW = 4;
  const EMPTY_ROW = 0;
  const allRepositories = [];

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
    const totalCommits = await getAllCommits(repo.name, username, FIRST_PAGE);

    const langaugeColor = await getLanguageColor(repo.language);

    const repositoryCard = new Card(
      repo.name,
      repo.html_url,
      totalCommits,
      repo.language,
      langaugeColor
    );

    allRepositories.push(repositoryCard);
  }

  sortArrayInDescendingOrder(allRepositories);

  allRepositories.forEach((repository) => {
    repository.createCard(username);

    const totalRows = document.getElementsByClassName('row').length;

    let lastRowCardCount = 0;

    newRow = document.createElement('div');
    newRow.className = 'row';

    if (totalRows !== 0) {
      lastRowCardCount = document.getElementsByClassName('row')[totalRows - 1].childElementCount;
    } else if (totalRows === EMPTY_ROW) {
      $(newRow).appendTo('#content');
    }

    // if the row is full
    if (lastRowCardCount === MAX_CARDS_PER_ROW) {
      $(newRow).insertAfter('.row:last');
    }

    $('.row:last').append(repository.cardContainer);
  });

  return true;
}

/**
 * Function name: sortArrayInDescendingOrder
 * Sorts given array in descending order
 * @param {Card} array - all repositories for user
 */
function sortArrayInDescendingOrder(array) {
  array.sort((a, b) => {
    return b.commitTotal - a.commitTotal;
  });
}

/**
 * Function name: getRepos
 * @param {string} username - GitHub username
 * Uses GitHub API to view programming languages for user
 */
async function getRepos(username) {
  const oAuthToken = '';

  const apiHeaders = {
    Authorization: `Token ${oAuthToken}`,
  };

  const url = `https://api.github.com/users/${username}/repos`;

  const response = await fetch(url, {
    method: 'GET',
    headers: apiHeaders,
  });

  const result = await response.json();

  const repositoriesCreated = await createCompleteOverview(result, username);

  if (repositoriesCreated) {
    document.getElementById('progressBar').style.display = 'none';
  }
}

/**
 * Function name: getAllCommits
 * @param {string} repositoryName - GitHub repository
 * @param {string} username - GitHub username
 * @param {int} page - Current page in api pagination
 * Returns all commits for each repository for a certain user
 */
async function getAllCommits(repositoryName, username, page) {
  const oAuthToken = '';

  const apiHeaders = {
    Authorization: `Token ${oAuthToken}`,
  };

  const commitUrl = `https://api.github.com/repos/${username}/${repositoryName}/commits?page=${page}&per_page=100`;

  const commitResponse = await fetch(commitUrl, {
    method: 'GET',
    headers: apiHeaders,
  });

  const commitResult = await commitResponse.json();

  let totalCommits = commitResult.length;

  if (totalCommits % 100 === 0) {
    totalCommits += await getAllCommits(repositoryName, username, page + 1);
  }

  return totalCommits;
}

/**
 * Function name: getAllCommitMessages
 * @param {string} repositoryName - GitHub repository
 * @param {string} username - GitHub username
 * returns object of languages for specific repository
 */
async function getAllCommitMessages(repository, username, page) {
  const oAuthToken = '';

  const apiHeaders = {
    Authorization: `Token ${oAuthToken}`,
  };

  const commitsUrl = `https://api.github.com/repos/${username}/${repository}/commits?page=${page}&per_page=100`;

  const result = await fetch(commitsUrl, {
    method: 'GET',
    headers: apiHeaders,
  });

  const commits = await result.json();

  document.getElementById('current-repository').innerHTML = repository;

  if (commits.length !== 0) {
    commits.forEach((commit) => {
      if (commit.author !== null && commit.author.login === username) {
        updateModal(commit.commit.message, commit.commit.author.date, commit.html_url);
      }
    });

    document.getElementById('modalContainer').style.display = 'block';
    if (commits.length % 100 === 0) {
      getAllCommitMessages(repository, username, page + 1);
    }

    if (document.getElementsByClassName('message-title').length === 0) {
      updateModal(`There were no commits by ${username} in this repository.`, '');
    }
  }
}

/**
 * Function name: updateTotalIssues
 * @param {string} repository - repository name
 * @param {string} username - GitHub username
 * @param {int} page - current page
 * Updates the total issue count in modal
 */
async function updateTotalIssues(repository, username, page) {
  const totalIssues = await getTotalIssues(repository, username, page);

  const counterLink = document.getElementsByClassName('Counter')[0];

  counterLink.innerHTML = totalIssues;
}

/**
 * Function name: getTotalIssues
 * @param {string} repository - repository name
 * @param {string} username - GitHub username
 * @param {int} page - curent page
 * Finds all issues in repository and returns total
 */
async function getTotalIssues(repository, username, page) {
  const oAuthToken = '';

  const apiHeaders = {
    Authorization: `Token ${oAuthToken}`,
  };

  const issuesUrl = `https://api.github.com/repos/${username}/${repository}/issues?page=${page}&per_page=100`;

  const result = await fetch(issuesUrl, {
    method: 'GET',
    headers: apiHeaders,
  });

  const issues = await result.json();

  return issues.length;
}

/**
 * Function name: updateModal
 * @param {string} message
 * @param {string} createdDate
 * Appends new commit message to modal
 */
function updateModal(message, createdDate, commitLink) {
  const innerContainer = document.getElementsByClassName('modal-content')[0];

  const messageContainer = document.createElement('p');
  messageContainer.className = 'message-title';

  if (createdDate === '') {
    messageContainer.innerHTML = `<a href="${commitLink}>${message}</a>`;
  } else {
    const localTime = new Date(createdDate).toLocaleDateString();
    messageContainer.innerHTML = `<a href="${commitLink}">${message}</a> <span class="timeStamp">Created at: ${localTime}`;
  }
  innerContainer.appendChild(messageContainer);
}

/**
 * Function name: getLanguageColor
 * @param {string} language - top language in repo
 * Returns color value associated with language in GitHub
 */
async function getLanguageColor(language) {
  if (language === null) {
    return '#000';
  }

  const url = chrome.runtime.getURL('colors.json');

  const response = await fetch(url);

  const colors = await response.json();

  return colors[language].color;
}

/**
 * Function name: getAllIssues
 * @param {string} repository  - current repository
 * @param {string} username  - GitHub username
 * @param {int} page - current page
 */
async function getAllIssues(repository, username, page) {
  const oAuthToken = '';

  const apiHeaders = {
    Authorization: `Token ${oAuthToken}`,
  };

  const issuesUrl = `https://api.github.com/repos/${username}/${repository}/issues?page=${page}&per_page=100`;

  const result = await fetch(issuesUrl, {
    method: 'GET',
    headers: apiHeaders,
  });

  const issues = await result.json();

  issues.forEach((issue) => {
    if (issue.user.login !== null && issue.user.login === username) {
      updateModal(issue.title, issue.created_at, issue.html_url);
    }
  });

  if (issues.length % 100 === 0) {
    getAllIssues(repository, username, page + 1);
  }
}

$('#repo-issues-link').click(() => {
  if ($('#commit-messages-link').attr('aria-current')) {
    $('#commit-messages-link').removeAttr('aria-current');
    $('#repo-issues-link').attr('aria-current', 'page');

    document.querySelectorAll('.message-title').forEach((element) => element.remove());
    const currentRepository = document.getElementById('current-repository').innerHTML;

    const FIRST_PAGE = 1;

    chrome.storage.sync.get('username', (result) => {
      getAllIssues(currentRepository, result.username, FIRST_PAGE);
    });
  }
});

$('#commit-messages-link').click(() => {
  if ($('#repo-issues-link').attr('aria-current')) {
    $('#repo-issues-link').removeAttr('aria-current');
    $('#commit-messages-link').attr('aria-current', 'page');

    document.querySelectorAll('.message-title').forEach((element) => element.remove());
    const currentRepository = document.getElementById('current-repository').innerHTML;

    const FIRST_PAGE = 1;

    chrome.storage.sync.get('username', (result) => {
      getAllCommitMessages(currentRepository, result.username, FIRST_PAGE);
    });
  }
});
