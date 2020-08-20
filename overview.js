chrome.tabs.executeScript({ file: 'jquery.min.js' });

chrome.storage.sync.get('username', (result) => {
  getRepos(result.username);
});

const modal = document.getElementById('myModal');

const closeButton = document.getElementsByClassName('close')[0];

const oAuthToken = '18fe433b89391c14eb050803d2d72c52f1c3f6e6';

const headers = {
  Authorization: `Token ${oAuthToken}`,
};

const buttons = document.getElementsByClassName('card-button');

class Card {
  constructor(repositoryName, repositoryLink, commitTotal, topLangauge, cardContainer) {
    this.repositoryName = repositoryName;
    this.repositoryLink = repositoryLink;
    this.commitTotal = commitTotal;
    this.topLangauge = topLangauge;
    this.cardContainer = cardContainer;
  }

  createCard() {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card';

    const cardTitleOuterContainer = document.createElement('div');
    cardTitleOuterContainer.className = 'card-text-section';

    const cardTitleInnerContainer = document.createElement('div');

    const repoLink = document.createElement('a');
    repoLink.href = this.repositoryLink;
    repoLink.target = '_blank';

    let repoNameText = document.createTextNode(this.repositoryName);

    repoLink.appendChild(repoNameText);

    if (this.repositoryName.length > 20) {
      cardTitleInnerContainer.className = 'card-title card-title-small';
    } else {
      cardTitleInnerContainer.className = 'card-title';
    }

    cardTitleInnerContainer.appendChild(repoLink);

    const overviewOutercontainer = document.createElement('div');
    overviewOutercontainer.className = 'card-text-section';

    const commitContainer = document.createElement('div');
    commitContainer.className = 'main-text';
    commitContainer.innerHTML = `Commits: ${this.commitTotal}`;

    const topLanguageContainer = document.createElement('div');
    topLanguageContainer.className = 'main-text';
    topLanguageContainer.innerHTML = `Top Language: ${this.topLangauge}`;

    const buttonRowContainer = document.createElement('div');
    buttonRowContainer.className = 'card-actions';

    const cardButton = document.createElement('div');
    cardButton.className = 'card-button';

    const buttonText = document.createElement('span');
    buttonText.className = 'label';
    buttonText.id = this.repositoryName;
    buttonText.innerHTML = 'View Commit Messages';

    cardButton.appendChild(buttonText);
    buttonRowContainer.appendChild(cardButton);

    overviewOutercontainer.appendChild(commitContainer);
    overviewOutercontainer.appendChild(topLanguageContainer);

    cardTitleOuterContainer.appendChild(cardTitleInnerContainer);

    cardContainer.appendChild(cardTitleOuterContainer);
    cardContainer.appendChild(overviewOutercontainer);
    cardContainer.appendChild(buttonRowContainer);
    this.cardContainer = cardContainer;
  }
}

document.body.onclick = function (ev) {
  if (ev.target.getAttribute('class') === 'label') {
    chrome.storage.sync.get('username', (result) => {
      getAllCommitMessages(ev.srcElement.id, result.username, 1);
    });
  }
};

closeButton.onclick = function () {
  modal.style.display = 'none';
  document.querySelectorAll('.message-title').forEach((element) => element.remove());
};

/**
 * Function name: createCompleteOverview
 * @param {JSON} userData - JSON result of all repositorys for user
 * @param {string} username - GitHub username
 * Creates cards containing total commits and top langauge
 */
async function createCompleteOverview(userData, username) {
  let isNewPage = false;
  try {
    var rowElements = document.getElementsByClassName('row')[0].childElementCount;
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
 * Function name: getRepos
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

  if (commits.length !== 0) {
    commits.forEach((commit) => {
      let innerContainer = document.getElementsByClassName('modal-content')[0];

      let messageContainer = document.createElement('p');
      messageContainer.className = 'message-title';
      messageContainer.appendChild(document.createTextNode(commit.commit.message));
      innerContainer.appendChild(messageContainer);
    });

    modal.style.display = 'block';
  }
  getAllCommitMessages(repository, username, page + 1);
}
