const modal = document.getElementById("myModal");

const closeButton = document.getElementsByClassName("close")[0];

const oAuthToken = "";

const headers = {
  Authorization: `Token ${oAuthToken}`,
};

const buttons = document.getElementsByClassName("card-button");

let username = "";

chrome.storage.sync.get("username", (result) => {
  username = result.username;
  document.getElementById("username").innerHTML = `${username}'s Repositories`;
  getRepos(username);
});

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

  createCard() {
    if (this.repositoryName.length > 20) {
      this.repositoryName = this.repositoryName.substr(0, 20) + "...";
    }

    const cardContainer = document.createElement("div");
    cardContainer.className = "card";

    cardContainer.innerHTML = `<div class="card-text-section">
                                  <div class="card-title">
                                    <a href="${this.repositoryLink}" target="_blank">${username}/${this.repositoryName}</a>
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

document.body.onclick = (ev) => {
  if (ev.target.getAttribute("class") === "label") {
    chrome.storage.sync.get("username", (result) => {
      getAllCommitMessages(ev.srcElement.id, result.username, 1);
    });
  }
};

closeButton.onclick = () => {
  modal.style.display = "none";
  document
    .querySelectorAll(".message-title")
    .forEach((element) => element.remove());
  document.getElementById("list-title").innerHTML = "";
};

/**
 * Function name: createCompleteOverview
 * @param {JSON} userData - JSON result of all repositories for the user
 * @param {string} username - GitHub username
 * Creates cards containing total commits and top langauge
 */
async function createCompleteOverview(userData) {
  let isNewPage = false;
  let rowElements = "";
  try {
    rowElements = document.getElementsByClassName("row")[0].childElementCount;
  } catch (error) {
    isNewPage = true;
  }

  let newRow = "";

  if (rowElements === 4 || isNewPage) {
    newRow = document.createElement("div");
    newRow.className = "row";
    $(newRow).insertAfter(".row:last");
  }

  for (repo of userData) {
    const totalCommits = await getAllCommits(repo.name, username, 1);

    let langaugeColor = await getLanguageColor(repo.language);

    let repositoryCard = new Card(
      repo.name,
      repo.html_url,
      totalCommits,
      repo.language,
      langaugeColor
    );

    repositoryCard.createCard();

    let totalRows = document.getElementsByClassName("row").length;

    let lastRowCardCount = 0;

    let newRow = document.createElement("div");
    newRow.className = "row";

    if (totalRows !== 0) {
      lastRowCardCount = document.getElementsByClassName("row")[totalRows - 1]
        .childElementCount;
    } else if (totalRows === 0) {
      $(newRow).appendTo("#content");
    }

    // if the row is full
    if (lastRowCardCount === 4) {
      $(newRow).insertAfter(".row:last");
    }

    $(".row:last").append(repositoryCard.cardContainer);
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
    method: "GET",
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
    method: "GET",
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
    method: "GET",
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
    method: "GET",
    headers: headers,
  });

  const commits = await result.json();

  document.getElementById(
    "list-title"
  ).innerHTML = `Commit Message Titles For: ${repository}`;

  if (commits.length !== 0) {
    commits.forEach((commit) => {
      if (commit.author !== null && commit.author.login === username) {
        updateModal(commit.commit.message, commit.commit.author.date);
      }
    });

    modal.style.display = "block";
    if (commits.length % 100 === 0) {
      getAllCommitMessages(repository, username, page + 1);
    }
  }

  if (document.getElementsByClassName("message-title").length === 0) {
    updateModal(`There were no commits by ${username} in this repository.`, "");
  }
}

function updateModal(message, createdDate) {
  const innerContainer = document.getElementsByClassName("modal-content")[0];

  const messageContainer = document.createElement("p");
  messageContainer.className = "message-title";
  if (createdDate === "") {
    messageContainer.appendChild(document.createTextNode(message));
  } else {
    messageContainer.appendChild(
      document.createTextNode(message + " created at: " + createdDate)
    );
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
    return "#000";
  }

  const url = chrome.runtime.getURL("colors.json");

  const response = await fetch(url);

  let colors = await response.json();

  return colors[language].color;
}
