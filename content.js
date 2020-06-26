let NOT_FOUND = -1;

class ToolTipIcon {
  constructor(toolTipElement, toolTipClass, toolTipText, gitHubElement) {
    this.toolTipElement = toolTipElement;
    this.toolTipClass = toolTipClass;
    this.toolTipText = toolTipText;
    this.gitHubElement = gitHubElement;
  }

  createIcon() {
    var toolTipContainer = document.createElement("div");
    toolTipContainer.className = this.toolTipClass;

    var circleIcon = document.createElement("span");
    circleIcon.className = "helpIconCircle";
    circleIcon.innerHTML = "?";

    var toolTip = document.createElement("span");
    toolTip.className = "helpIconText";
    toolTip.innerHTML = this.toolTipText;

    toolTipContainer.appendChild(circleIcon);
    toolTipContainer.appendChild(toolTip);

    this.toolTipElement = toolTipContainer;
  }
}

// check the current url and call functions accordingly
checkURL();

/**
 * Function name: checkURL
 * Checks the windows current URL for keywords to determine which tooltips
 * to display
 */
function checkURL() {
  // if the user is editing a markdown file
  if (
    window.location.href.indexOf(".md") != NOT_FOUND &&
    window.location.href.indexOf("edit" != NOT_FOUND)
  ) {
    addReadMeToolTips();
    // if the user is reviewing a pull request
  } else if (window.location.href.indexOf("compare") != NOT_FOUND) {
    addProposeChangesToolTips();
  } else if (
    window.location.href.indexOf("pull") != NOT_FOUND &&
    window.location.href.indexOf("quick_pull") == NOT_FOUND
  ) {
    addReviewPullRequestTips();
    // if the user is opening a pull request
  } else if (document.getElementsByClassName("h-card").length != 0) {
    createProfileCard();
  } else {
    console.log("not found");
  }
}

/**
 * Function name: addProgressBar
 * Adds progressBar above forms in GitHub pages to let user how far they are
 * in editing files
 * @param currentStep current step in process
 * @param totalSteps the amount of steps in process to determine overall progress
 * @param rootElement className of GitHub HTML element that the progress bar
 *                      will be added to
 */
function addProgressBar(currentStep, totalSteps, rootElement, stepsList) {
  // create the progress bar element
  var progressBarContainer = document.createElement("div");
  progressBarContainer.className = "container";

  var progressBar = document.createElement("div");
  progressBar.className = "progressbar";

  var itemList = document.createElement("ul");

  for (index = 1; index <= stepsList.length; index++) {
    var listItem = document.createElement("li");
    listItem.innerHTML = stepsList[index - 1];

    if (index == currentStep) {
      listItem.className += " partial";
    }
    // if the user has already completed a step
    else if (index < currentStep) {
      listItem.className = "partial completed";
    }

    itemList.appendChild(listItem);
  }

  progressBar.appendChild(itemList);

  progressBarContainer.appendChild(progressBar);

  $(progressBarContainer).insertBefore(rootElement);
}

/**
 * Function name: addReadMeToolTips
 * Adds tooltips to webpage when editing markdown files
 * First step in editing markdown files
 */
function addReadMeToolTips() {
  var steps = [
    "Edit ReadMe File",
    "Confirm Pull Request",
    "Review Pull Request",
  ];

  // progress bar above editor
  addProgressBar(1, 3, ".js-blob-form", steps);

  // icon to right of file name input
  var fileNameChangeText =
    "This is the file name, changing it will create " +
    " a new file with the new name";

  var breadCrumbDiv = ".d-md-inline-block";

  let fileNameChangeIcon = new ToolTipIcon(
    "H4",
    "helpIcon",
    fileNameChangeText,
    breadCrumbDiv
  );

  fileNameChangeIcon.createIcon();

  $(fileNameChangeIcon.toolTipElement).insertAfter(
    fileNameChangeIcon.gitHubElement
  );

  // banner above commit message input
  var commitTitleText =
    "This is the title. Give a brief description of the change. Be short and objective.";

  var inputTitleLabel = document.createElement("h3");
  inputTitleLabel.innerHTML = "Insert a title here";
  inputTitleLabel.style.display = "inline-block";
  inputTitleLabel.style.marginRight = "20px";

  $(inputTitleLabel).insertBefore("#commit-summary-input");

  let commitMessageIcon = new ToolTipIcon(
    "H4",
    "helpIcon",
    commitTitleText,
    "#commit-summary-input"
  );

  commitMessageIcon.createIcon();

  $(commitMessageIcon.toolTipElement).insertAfter("#commit-summary-input");

  var descriptionText =
    "Add a more detailed description if needed. Here you can" +
    " present your arguments and reasoning that lead to change.";

  var inputDescriptionLabel = document.createElement("h3");
  inputDescriptionLabel.innerHTML = "Insert a <br> description here";
  inputDescriptionLabel.style.display = "inline-block";
  inputDescriptionLabel.style.marginRight = "22px";

  $(inputDescriptionLabel).insertBefore("#commit-description-textarea");

  let extendedDescIcon = new ToolTipIcon(
    "H4",
    "helpIcon",
    descriptionText,
    "#commit-description-textarea"
  );

  extendedDescIcon.createIcon();

  $(extendedDescIcon.toolTipElement).insertAfter(
    extendedDescIcon.gitHubElement
  );

  // banner above Commit Changes / Cancel buttons
  var submitChangesText =
    "By clicking the Commit changes button you " +
    "will start the submission process. You " +
    "will have the chance to check your changes " +
    "before finalizing it.";

  let submitChangesIcon = new ToolTipIcon(
    "H4",
    "helpIcon",
    submitChangesText,
    "#submit-file"
  );

  submitChangesIcon.createIcon();

  submitChangesIcon.toolTipElement.style.marginRight = "20px";

  $(submitChangesIcon.toolTipElement).insertBefore(
    submitChangesIcon.gitHubElement
  );
}

/**
 * Function name: addProposeChangesToolTips
 * Adds tooltips to webpage when confirming a change to file
 * Second step in editing markdown files
 */
function addProposeChangesToolTips() {
  var steps = [
    "Edit ReadMe File",
    "Confirm Pull Request",
    "Review Pull Request",
  ];

  addProgressBar(2, 3, ".repository-content", steps);

  var branchContainerText =
    "This represents the origin and destination of " +
    "your changes if you are not sure, leave it how it " +
    "is, this is common for small changes.";

  var topRibbon = document.getElementsByClassName("js-range-editor")[0];
  topRibbon.style.width = "93%";
  topRibbon.style.display = "inline-block";

  // ribbon above current current branch and new pull request branch
  let currentBranchIcon = new ToolTipIcon(
    "H4",
    "helpIcon",
    branchContainerText,
    ".js-range-editor"
  );

  currentBranchIcon.createIcon();

  $(currentBranchIcon.toolTipElement).insertAfter(
    currentBranchIcon.gitHubElement
  );

  var test = document.getElementsByClassName("d-flex flex-justify-end m-2")[0];
  test.classList.remove("flex-justify-end");
  test.classList.add("flex-justify-start");

  var confirmPullRequestText =
    "By clicking here you will have a chance to change the " +
    "description of the change and continue with the submission " +
    "process.";

  // icon next to create pull request button
  let createPullRequestBtn = new ToolTipIcon(
    "H4",
    "helpIcon",
    confirmPullRequestText,
    ".js-pull-request-button"
  );

  createPullRequestBtn.createIcon();

  $(createPullRequestBtn.toolTipElement).insertAfter(
    createPullRequestBtn.gitHubElement
  );

  var summaryText =
    "This shows the amount of commits in the pull request, " +
    "the amount of files you changed in the pull request, " +
    "how many comments were on the commits for the pull request" +
    " and the ammount of people who worked together on this " +
    "pull request.";

  var summaryClass = ".overall-summary";

  // override the container width and display to add icon
  var numbersSummaryContainer = document.getElementsByClassName(
    "overall-summary"
  )[0];
  numbersSummaryContainer.style.width = "93%";
  numbersSummaryContainer.style.display = "inline-block";

  // icon above summary of changes and commits
  let requestSummaryIcon = new ToolTipIcon(
    "H4",
    "helpIcon",
    summaryText,
    summaryClass
  );

  requestSummaryIcon.createIcon();

  requestSummaryIcon.toolTipElement.style = "float:right;";

  $(requestSummaryIcon.toolTipElement).insertAfter(
    requestSummaryIcon.gitHubElement
  );

  var comparisonClass = ".details-collapse";

  var changesText =
    "This shows the changes between the orginal file and " +
    "your version. Green(+) represents lines added. " +
    "Red(-) represents removed lines";

  // icon above container for changes in current pull request
  let comparisonIcon = new ToolTipIcon(
    "H4",
    "helpIcon",
    changesText,
    comparisonClass
  );

  comparisonIcon.createIcon();
  //comparisonIcon.toolTipElement.style = "float:right;";

  var numbersSummaryContainer = document.getElementsByClassName(
    "details-collapse"
  )[0];
  numbersSummaryContainer.style.width = "93%";
  numbersSummaryContainer.style.display = "inline-block";

  $(comparisonIcon.toolTipElement).insertAfter(comparisonIcon.gitHubElement);
}

/**
 * Function name: addReviewPullRequestTips
 * Adds tooltips to webpage when reviewing pull requests
 * Third step in editing markdown files
 */
function addReviewPullRequestTips() {
  var steps = [
    "Edit ReadMe File",
    "Confirm Pull Request",
    "Review Pull Request",
  ];

  addProgressBar(3, 3, ".gh-header-show", steps);

  var branchContainerText =
    "This indicates that the pull request is open " +
    "meaning someone will get to it soon. ";

  let pullRequestStatusIcon = new ToolTipIcon(
    "H4",
    "helpIcon",
    branchContainerText,
    ".js-clipboard-copy"
  );

  pullRequestStatusIcon.createIcon();

  $(pullRequestStatusIcon.toolTipElement).insertAfter(
    pullRequestStatusIcon.gitHubElement
  );

  var requestButtonsText =
    "This will close the pull request meaning people " +
    "cannot view this! Do not click close unless the " +
    "request was solved. ";

  var requestButtonsClass = ".js-comment-and-button";

  let closePullRequestIcon = new ToolTipIcon(
    "H4",
    "helpIcon",
    requestButtonsText,
    requestButtonsClass
  );

  closePullRequestIcon.createIcon();

  $(closePullRequestIcon.toolTipElement).insertBefore(
    closePullRequestIcon.gitHubElement
  );
}

/**
 * Function name: addForkToolTips
 * Edits tooltips when viewing a repository that you are not a contributor of
 */
function addForkToolTips() {
  // get the second instance of icon to edit tool tip
  var pencilIcon = document.getElementsByClassName(
    "btn-octicon tooltipped tooltipped-nw"
  )[1];

  pencilIcon.setAttribute("aria-label", "Edit Readme");
}

/**
 * Function name: createProfileCard
 *
 */
function createProfileCard() {
  let showGraphIcon = new ToolTipIcon(
    "H4",
    "helpIcon graph-tooltip",
    "Click this tooltip to show more info about the user",
    ".js-calendar-graph"
  );
  
  var username = document.getElementsByClassName('vcard-username')[0].innerHTML;
  
  createCardContainer();

  getRepos(username);

  showGraphIcon.createIcon();

  $(showGraphIcon.toolTipElement).insertBefore(showGraphIcon.gitHubElement);

  $(".helpIcon").click(function () {
    $(".back").toggleClass("hovered");
    $("#js-contribution-activity").toggleClass("hidden");
    $("#user-activity-overview").toggleClass("hidden");
  });
}


/**
 * Function: createCardContainer
 * Creates card with four quadrants behind graph in GitHub user's profile page
 */
function createCardContainer() {
  var outerContainer = document.getElementsByClassName(
    "graph-before-activity-overview"
  )[0];

  outerContainer.className += " card-container";

  var cardBack = document.createElement("div");
  cardBack.className = "back";

  var repoGraph = document.createElement("canvas");
  repoGraph.className = "graph";
  repoGraph.style.borderRight = "1px solid black";
  repoGraph.style.borderBottom = "1px solid black";
  repoGraph.style.float = "left";
  repoGraph.id = "myChart";

  var skillGraph = document.createElement("canvas");
  skillGraph.className = "graph";
  skillGraph.style.borderBottom = "1px solid black";
  skillGraph.id = "skillGraph";
  skillGraph.style.float = "right";

  var commitsGraph = document.createElement("canvas");
  commitsGraph.className = "graph";
  commitsGraph.style.borderRight = "1px solid black";
  commitsGraph.style.float = "left";
  commitsGraph.id = "commitsGraph";

  var languagesGraph = document.createElement("canvas");
  languagesGraph.className = "graph";
  languagesGraph.id = "languagesGraph";
  languagesGraph.style.float = "right";

  cardBack.appendChild(repoGraph);
  cardBack.appendChild(skillGraph);
  cardBack.appendChild(commitsGraph);
  cardBack.appendChild(languagesGraph);

  outerContainer.appendChild(cardBack);
}

/**
 * function getRepos
 * @param string username - GitHub username for API 
 * Uses GitHub API to view programming languages for user
 */
async function getRepos( username ) {
  const oAuthToken = 'b1cb7d1ff339447f8a3cad88bd6216f36423dfae';

  const colors = [ "#3e95cd","#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850",
      "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd",
      "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850" ];

  const headers = {
    "Authorization" : 'Token ' + oAuthToken
  }

  const url = "https://api.github.com/users/" + username + "/repos";
  const response = await fetch(url, {
    "method" : "GET",
    "headers": headers
  });
  
  const result = await response.json();

  var languages = [];
  var repositoryNames = [];
  var labels = {};
  var dataSet = {};

  result.forEach((index) => {

    languages.push(index.language);
    repositoryNames.push(index.name);
  });

  getCommits( repositoryNames, username );

  var repoGraphContainer = document.getElementById("myChart");

  var count = {};

  for (var index = 0; index < languages.length; index++) {
    if (!count[languages[index]]) {
      count[languages[index]] = 0;
    }
    count[languages[index]]++;
  }

  labels = Object.keys(count);
  dataSet = Object.values(count);

  myBarChart = new Chart(repoGraphContainer, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Repositories",
          backgroundColor: colors,
          data: dataSet,
        },
      ],
    },
    options: {
      responsive: false,
      legend: { display: false },
      title: {
        display: true,
        text: "Programming languge totals for " + username + "'s repositories",
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    },
  });

}

/**
 * function getCommits
 * @param string username - GitHub username for API 
 * Uses GitHub API to view commit totals for user
 */
async function getCommits( repositories, username ) {
  const oAuthToken = 'b1cb7d1ff339447f8a3cad88bd6216f36423dfae';
  
  const colors = [ "#3e95cd","#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850",
      "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd",
      "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850" ];

  var total = 0; 
  var repoObject = {};
  var ctx = document.getElementById("repositories");
  var skillGraphContainer = document.getElementById("skillGraph");

  const headers = {
    "Authorization" : 'Token ' + oAuthToken
  }

 for (const repo of repositories) {
    var commitUrl = "https://api.github.com/repos/" + username + "/" + repo + "/commits?page=1&per_page=50";
    
    var commitResponse = await fetch(commitUrl,
      {
        "method": "GET",
        "headers": headers
      });

    var commitResult = await commitResponse.json();
    repoObject[repo] = commitResult.length;
 };

 var labels = Object.keys(repoObject);
 var data = Object.values(repoObject);

 myBarChart = new Chart(skillGraphContainer, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Commits",
          backgroundColor: colors,
          data: data,
        },
      ],
    },
    options: {
      responsive: false,
      legend: { display: false },
      title: {
        display: true,
        text: "Commits per repository for: " + username,
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            steps: 5,
            stepValue: 10,
            max: 50
          }
        }]
      }
    },
  });

}
