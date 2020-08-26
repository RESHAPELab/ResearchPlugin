let injected = false;

window.onload = () => {
  const currentPageUrl = document.location.pathname;

  if (!injected) {
    injected = true;
    checkUrl(currentPageUrl);
  }
};

class ToolTipIcon {
  constructor(toolTipElement, toolTipClass, toolTipText, gitHubElement) {
    this.toolTipElement = toolTipElement;
    this.toolTipClass = toolTipClass;
    this.toolTipText = toolTipText;
    this.gitHubElement = gitHubElement;
  }

  createIcon() {
    const toolTipContainer = document.createElement('div');
    toolTipContainer.className = this.toolTipClass;

    toolTipContainer.innerHTML = `<span class="helpIconCircle">?</span>
                                  <span class="helpIconText">${this.toolTipText}</span>`;

    this.toolTipElement = toolTipContainer;
  }
}

/**
 * Function name: checkUrl
 * @param {string} currentUrl - pathname of current url
 * Checks the windows current URL to determine which tooltips to display
 */
function checkUrl(currentUrl) {
  // check if the user wants to edit a file that they are not an owner of
  if (checkIsEditingForkedFile()) {
    createForkedFileToolTips();
  } else if (currentUrl.includes('/edit/')) {
    createFileEditorToolTips();
  } else if (currentUrl.includes('/compare/')) {
    createConfirmPullRequestToolTips();
  }
  // if the user is reviewing a pull request
  else if (currentUrl.includes('/pull/')) {
    createReviewPullRequestToolTips();
  }
  // if the user is opening a pull request
  else if (document.getElementsByClassName('h-card').length !== 0) {
    updateProfileCard();
  }
  // if the user is creating a new issue
  else if (currentUrl.includes('/issues/new')) {
    createReportIssueToolTips();
  } else if (currentUrl.includes('/issues/')) {
    createReviewIssueToolTips();
  } else {
    // do nothing
  }
}

/**
 * Function name: sortArrayInDescendingOrder
 * Sorts given array in descending order
 * @param {int} array
 */
function sortArrayInDescendingOrder(array) {
  array.sort((a, b) => {
    return b - a;
  });
}

/**
 * Function name: checkIsEditingForkedFile
 * Checks if the user is viewing a file that they do not own
 */
function checkIsEditingForkedFile() {
  const pencilIconLabelsList = [
    'Edit the file in your fork of this project',
    'Fork this project and edit the file',
  ];

  try {
    const pencilIconLabel = document
      .getElementsByClassName('tooltipped')[2]
      .getAttribute('aria-label');

    // check if there is a pencil icon with this aria label
    return pencilIconLabelsList.includes(pencilIconLabel);
  } catch (error) {
    return false;
  }
}

/**
 * Function name: createForkedFileToolTips
 * Edits tooltips when viewing a repository that you are not a contributor of
 */
function createForkedFileToolTips() {
  $('.tooltipped-nw:nth-child(2)').attr('aria-label', 'Edit File');
}

/**
 * Function name: addProgressBar
 * @param {int} currentStep - current step in process
 * @param {int} totalSteps - the total amount of steps in process
 * @param {string} rootElement - className of HTML element that the progress bar
 *                      will be added to
 *  Adds progressBar above forms in GitHub pages to let user how far they are in a process
 */
function addProgressBar(currentStep, totalSteps, rootElement, stepsList) {
  // create the progress bar element
  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'container';

  const progressBar = document.createElement('div');
  progressBar.className = 'progressbar';

  const itemList = document.createElement('ul');

  let index;

  for (index = 1; index <= stepsList.length; index += 1) {
    const listItem = document.createElement('li');
    listItem.innerHTML = stepsList[index - 1];

    // if all steps have been completed
    if (currentStep === totalSteps) {
      listItem.className = 'completed';
      // if the step is in progress
    } else if (index === currentStep) {
      listItem.className = 'partial';
    }
    // if the user has already completed a step
    else if (index < currentStep) {
      listItem.className = 'partial completed';
    }
    itemList.appendChild(listItem);
  }

  progressBar.appendChild(itemList);

  progressBarContainer.appendChild(progressBar);

  $(progressBarContainer).insertBefore(rootElement);

  if (isProcessCompleted()) {
    createSuccessRibbon();
  }
}

/**
 * Function name: isProcessCompleted
 * Checks if issue or pull request was succesfully created and is open in the repo
 */
function isProcessCompleted() {
  let status = '';
  try {
    status = document.getElementsByClassName('State')[0].getAttribute('title');
  } catch (error) {
    return false;
  }
  return status === 'Status: Open';
}

/**
 * Function name: createSuccessRibbon
 * Creates ribbon above progress bar to inform the user that the process is successful
 */
function createSuccessRibbon() {
  let processType = 'pull request';

  if (document.location.pathname.includes('/issues/')) {
    processType = 'issue';
  }

  const successRibbonContainer = document.createElement('div');
  successRibbonContainer.className = 'successRibbon';

  const ribbonMessage = document.createTextNode(
    `The ${processType}  was created successfully and will be reviewed shortly`
  );

  successRibbonContainer.appendChild(ribbonMessage);

  $(successRibbonContainer).insertBefore('.container');
}

/**
 * Function name: createFileEditorToolTips
 * Adds tooltips when editing files (First step)
 */
function createFileEditorToolTips() {
  const steps = ['Edit File', 'Confirm Pull Request', 'Pull Request Opened'];

  // progress bar above editor
  addProgressBar(1, 3, '.js-blob-form', steps);

  // icon to right of file name input
  const fileNameChangeText =
    'This is the file name, changing it will create a new file with the new name.';

  const breadCrumbDiv = '.d-md-inline-block';

  const fileNameChangeIcon = new ToolTipIcon('H4', 'helpIcon', fileNameChangeText, breadCrumbDiv);

  fileNameChangeIcon.createIcon();

  $(fileNameChangeIcon.toolTipElement).insertAfter(fileNameChangeIcon.gitHubElement);

  // banner above commit message input
  const commitTitleText =
    'This is the title of the pull request. Give a brief description of the change. Be short and objective.';

  const inputTitleLabel = document.createElement('h3');
  inputTitleLabel.innerHTML = 'Insert a title here';
  inputTitleLabel.className = 'label-margin-right';

  $(inputTitleLabel).insertBefore('#commit-summary-input');

  const commitMessageIcon = new ToolTipIcon(
    'H4',
    'helpIcon',
    commitTitleText,
    '#commit-summary-input'
  );

  commitMessageIcon.createIcon();

  $(commitMessageIcon.toolTipElement).insertAfter('#commit-summary-input');

  const descriptionText =
    'Add a more detailed description of the pull request if needed. Here you can present your arguments and reasoning that lead to change.';

  const inputDescriptionLabel = document.createElement('h3');
  inputDescriptionLabel.innerHTML = 'Insert a <br> description here';
  inputDescriptionLabel.className = 'label-margin-right';

  $(inputDescriptionLabel).insertBefore('#commit-description-textarea');

  const extendedDescIcon = new ToolTipIcon(
    'H4',
    'helpIcon',
    descriptionText,
    '#commit-description-textarea'
  );

  extendedDescIcon.createIcon();

  $(extendedDescIcon.toolTipElement).insertAfter(extendedDescIcon.gitHubElement);

  let commitChangesText =
    'By clicking the Commit Changes button the changes will automatically be pushed to the repo';

  const buttonText = document.getElementsByClassName('btn-primary')[1].innerText;

  if (buttonText === 'Propose changes') {
    commitChangesText =
      'By clicking the Propose changes button you will start the pull request submission process. You will have the chance to check your changes before finalizing it.';
  }

  const submitChangesIcon = new ToolTipIcon('H4', 'helpIcon', commitChangesText, '#submit-file');

  submitChangesIcon.createIcon();

  submitChangesIcon.toolTipElement.style.marginRight = '20px';

  $(submitChangesIcon.toolTipElement).insertBefore(submitChangesIcon.gitHubElement);
}

$('input[name="commit-choice"]').click(() => {
  const pullChangesText =
    'By clicking the Propose changes button you will start the pull request submission process. You will have the chance to check your changes before finalizing it.';

  const directCommitText =
    'By clicking the Commit Changes button the changes will be directly pushed to the repo';

  $('.helpIconText:eq(3)').toggleText(directCommitText, pullChangesText);
});

/**
 * Custom jQuery function to toggle text
 */
$.fn.extend({
  toggleText: function (a, b) {
    return this.text(this.text() === b ? a : b);
  },
});

/**
 * Function name: createConfirmPullRequestToolTips
 * Creates tooltips when confirming a change to file (Second step)
 */
function createConfirmPullRequestToolTips() {
  const steps = ['Edit File', 'Create Pull Request', 'Pull Request Opened'];

  addProgressBar(2, 3, '.repository-content', steps);

  $('#pull_request_body').attr(
    'placeholder',
    'You can add a more detailed description of the pull request here if needed.'
  );

  let branchName = '';
  let isComparingBranch = false;
  try {
    branchName = document.getElementsByClassName('branch-name')[0].innerText;
  } catch (error) {
    isComparingBranch = true;
  }

  let newHeaderText = `Finish the pull request submission below to allow others to accept the changes. These changes can be viewed later under the branch name:
    ${branchName}`;

  if (isComparingBranch) {
    newHeaderText =
      'Finish the pull request submission below to allow others to accept the changes';

    $('.Subhead-heading').text('Create Pull Request');
  }

  $('.Subhead-description').text(newHeaderText);

  const pullRequestTitle = document.getElementsByClassName('Subhead-heading')[1];
  pullRequestTitle.innerHTML = 'Create pull request';

  const branchContainerText =
    'This represents the origin and destination of your pull request. If you are not sure, leave it how it is, this is common for small changes.';

  const topRibbon = document.getElementsByClassName('js-range-editor')[0];
  topRibbon.style.width = '93%';
  topRibbon.style.display = 'inline-block';

  // icon next to current branch and new pull request branch name
  const currentBranchIcon = new ToolTipIcon(
    'H4',
    'helpIcon',
    branchContainerText,
    '.js-range-editor'
  );

  currentBranchIcon.createIcon();

  $(currentBranchIcon.toolTipElement).insertAfter(currentBranchIcon.gitHubElement);

  // move button row to left side of editor
  if (!isComparingBranch) {
    const buttonRow = document.getElementsByClassName('d-flex flex-justify-end m-2')[0];
    buttonRow.classList.remove('flex-justify-end');
    buttonRow.classList.add('flex-justify-start');
  }

  const confirmPullRequestText =
    'By clicking this button you will create the pull request to allow others to view your changes and accept them into the repository.';

  const submitButtonClass = '.js-pull-request-button';

  // icon next to create pull request button
  const createPullRequestBtn = new ToolTipIcon(
    'H4',
    'helpIcon',
    confirmPullRequestText,
    submitButtonClass
  );

  createPullRequestBtn.createIcon();

  $(createPullRequestBtn.toolTipElement).insertAfter(createPullRequestBtn.gitHubElement);

  const summaryText =
    'This shows the amount of commits in the pull request, the amount of files you changed in the pull request, how many comments were on the commits for the pull request and the ammount of people who worked together on this pull request.';

  const summaryClass = '.overall-summary';

  // override the container width and display to add icon
  const numbersSummaryContainer = document.getElementsByClassName('files-bucket')[0];
  numbersSummaryContainer.style.width = '93%';
  numbersSummaryContainer.style.display = 'inline-block';

  // icon above summary of changes and commits
  const requestSummaryIcon = new ToolTipIcon('H4', 'helpIcon', summaryText, summaryClass);

  requestSummaryIcon.createIcon();

  requestSummaryIcon.toolTipElement.style = 'float:right;';

  $(requestSummaryIcon.toolTipElement).insertAfter(requestSummaryIcon.gitHubElement);

  const comparisonClass = '.details-collapse';

  const changesText =
    'This shows the changes between the orginal file and your version. Green(+) represents lines added. Red(-) represents removed lines';

  // icon above container for changes in current pull request
  const comparisonIcon = new ToolTipIcon('H4', 'helpIcon', changesText, comparisonClass);

  comparisonIcon.createIcon();

  const commitSummaryContainer = document.getElementsByClassName('details-collapse')[0];

  commitSummaryContainer.style.width = '93%';
  commitSummaryContainer.style.display = 'inline-block';

  $(comparisonIcon.toolTipElement).insertAfter(comparisonIcon.gitHubElement);

  setTimeout(changeMergeText, 2500);
}

/**
 * Function name: changeMergeText
 * Updates text when there is a merge conflict in a pull request
 */
function changeMergeText() {
  let canMerge = false;
  try {
    document.getElementsByClassName('text-red')[0].innerText;
  } catch (error) {
    // if the 'text-red' element does not exist, then the pull request can be merged automatically
    canMerge = true;
  }

  if (!canMerge) {
    $('.pre-mergability').html(
      "<strong class='text-red'>There is a merge conflict, but this can be fixed by creating the pull request.</strong>Don't worry, the owner of the repository will fix this for you."
    );
  }
}
/**
 * Function name: createReviewPullRequestToolTips
 * Adds tooltips when reviewing a pull request (Final step)
 */
function createReviewPullRequestToolTips() {
  const steps = ['Edit File', 'Confirm Pull Request', 'Pull Request Opened'];

  addProgressBar(3, 3, '.gh-header-show', steps);

  const pullRequestName = document.getElementsByClassName('js-issue-title')[0].innerText;

  const branchContainerText =
    'This indicates that the pull request is open meaning someone will get to it soon.';

  const pullRequestStatusIcon = new ToolTipIcon(
    'H4',
    'helpIcon',
    branchContainerText,
    '.gh-header-meta:nth-child(1)'
  );

  pullRequestStatusIcon.createIcon();

  $(pullRequestStatusIcon.toolTipElement).insertBefore(pullRequestStatusIcon.gitHubElement);

  const requestButtonsText =
    'This will close the pull request meaning people cannot view this! Do not click close unless the request was solved.';

  const requestButtonsClass = '.js-comment-and-button';

  const closePullRequestIcon = new ToolTipIcon(
    'H4',
    'helpIcon',
    requestButtonsText,
    requestButtonsClass
  );

  closePullRequestIcon.createIcon();

  $(closePullRequestIcon.toolTipElement).insertBefore(closePullRequestIcon.gitHubElement);

  closePullRequestIcon.toolTipElement.style.marginRight = '20px';

  const submitButtons = document.getElementsByClassName('d-flex flex-justify-end')[0];
  submitButtons.classList.remove('flex-justify-end');
  submitButtons.classList.add('flex-justify-start');

  $('.js-quick-submit-alternative').click((event) => {
    if (!confirm(`Are you sure that you want to close the pull request: ${pullRequestName}?`)) {
      event.preventDefault();
    }
  });
}

/**
 * Function name: createReportIssueToolTips
 * Adds tooltips to page when opening a new issue report (First step)
 */
function createReportIssueToolTips() {
  const steps = ['Report Issue', 'Issue Submitted'];

  // progress bar above editor
  addProgressBar(1, 2, '.new_issue', steps);

  const submitButtonText =
    'By clicking this, it will submit the issue to the owner of the repository';

  const submitButtonClass = '.flex-justify-end button:eq(0)';

  const submitButtonIcon = new ToolTipIcon('H4', 'helpIcon', submitButtonText, submitButtonClass);

  submitButtonIcon.createIcon();

  $(submitButtonIcon.toolTipElement).insertAfter(submitButtonIcon.gitHubElement);
}

/**
 * Function name: createReviewIssueToolTips
 * Adds tooltips to page when reviewing a new issue report (Final step)
 */
function createReviewIssueToolTips() {
  const issueTitle = document.getElementsByClassName('js-issue-title')[0].innerText;

  const steps = ['Report Issue', 'Issue Submitted'];

  addProgressBar(2, 2, '.repository-content', steps);

  const buttonRow = document.getElementsByClassName('d-flex flex-justify-end')[0];
  buttonRow.classList.remove('flex-justify-end');
  buttonRow.classList.add('flex-justify-start');

  const closeIssueIconText =
    'This will close the issue request meaning people cannot view this! Do not click close unless the request was solved. ';

  const closeButtonClass = '.flex-justify-end button:eq(0)';

  const submitButtonIcon = new ToolTipIcon('H4', 'helpIcon', closeIssueIconText, closeButtonClass);

  submitButtonIcon.createIcon();

  submitButtonIcon.toolTipElement.style.marginRight = '20px';

  $(submitButtonIcon.toolTipElement).insertBefore(submitButtonIcon.gitHubElement);

  $('.js-quick-submit-alternative').click(function (event) {
    if (!confirm(`Are you sure that you want to close the issue: ${issueTitle}?`)) {
      event.preventDefault();
    }
  });
}

/**
 * Function name: updateProfileCard
 * Updates contribution graph to show icon to toggle between graphs
 */
function updateProfileCard() {
  const toggleButton = document.createElement('button');
  toggleButton.className = 'btn mb-3 toggleBtn';
  toggleButton.innerText = 'Click to show more information';

  const username = document.getElementsByClassName('vcard-username')[0].innerHTML;

  createCardContainer();

  getRepos(username);

  getApis(username);

  $(toggleButton).insertAfter('.contrib-footer ');

  $('.toggleBtn').click(() => {
    if ($('.toggleBtn').text() === 'Click to show more information') {
      $('.toggleBtn').text('X');
      $('.toggleBtn').addClass('closeButton');
    } else {
      $('.toggleBtn').text('Click to show more information');
      $('.toggleBtn').removeClass('closeButton');
    }
    $('.back').toggleClass('hovered');
    $('#js-contribution-activity').toggleClass('hidden');
    $('#user-activity-overview').toggleClass('hidden');
  });
}

/**
 *Function name: createCardContainer
 * Creates structure of profile overview with graphs
 */
function createCardContainer() {
  const outerContainer = document.getElementsByClassName('graph-before-activity-overview')[0];

  outerContainer.className += ' card-container';

  const cardBack = document.createElement('div');
  cardBack.className = 'back';

  cardBack.innerHTML = `<div class="link-row">
                          <h4 id="test">View all information<span class="complete-list-link" id="overviewLink"> here</span></h4>
                        </div>
                        <canvas class="graph" id="myChart"></canvas>
                        <canvas class="graph" id="skillGraph"></canvas>
                        <canvas class="graph" id="commitsGraph"></canvas>
                        <canvas class="graph" id="languagesGraph"></canvas>`;

  outerContainer.appendChild(cardBack);
}

$(document).ready(() => {
  $(document).click((event) => {
    if (event.target.className === 'complete-list-link') {
      const githubUsername = document.getElementsByClassName('vcard-username')[0].innerHTML;

      chrome.storage.sync.set({ username: githubUsername });

      chrome.runtime.sendMessage({
        type: 'OPEN_COMPLETE_OVERVIEW',
      });
    }
  });
});

/**
 * Function name: getCommits
 * @param {string} username - GitHub username for API
 * Uses GitHub API to view commit totals for user
 */
async function getCommits(repositories, username) {
  const oAuthToken = '';

  const headers = {
    Authorization: `Token ${oAuthToken}`,
  };

  const repoObject = {};

  const skillGraphContainer = document.getElementById('skillGraph');
  let total = 0;

  for (const repo of repositories) {
    if (total < 10) {
      const commitUrl = `https://api.github.com/repos/${username}/${repo}/commits?page=1&per_page=25`;

      const commitResponse = await fetch(commitUrl, {
        method: 'GET',
        headers: headers,
      });

      const commitResult = await commitResponse.json();
      repoObject[repo] = commitResult.length;

      total += 1;
    }
  }

  const labels = Object.keys(repoObject);
  const data = Object.values(repoObject);

  labels.sort((a, b) => {
    return repoObject[b] - repoObject[a];
  });

  sortArrayInDescendingOrder(data);

  const graphTitle = `Commits per repository for:  ${username}`;

  createNewBarGraph(skillGraphContainer, graphTitle, labels, data);
}

/**
 * Function name: getRepos
 * @param {string} username - GitHub username for API
 * Uses GitHub API to view programming languages for user
 */
async function getRepos(username) {
  const graphTitle = `Programming languge totals for ${username}'s repositories`;
  const repoGraphContainer = document.getElementById('myChart');
  const MAX_COUNT = 10;

  const languages = [];
  const repositoryNames = [];
  const repositoriesObject = {};

  const oAuthToken = '';

  const url = `https://api.github.com/users/${username}/repos`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Token ${oAuthToken}`,
    },
  });

  const repositories = await response.json();

  let graphLabels = {};
  let graphDataSet = {};

  let total = 0;

  repositories.forEach((repository) => {
    if (repository.language != null && total < MAX_COUNT) {
      languages.push(repository.language);
      repositoryNames.push(repository.name);
      total += 1;
    }
  });

  getCommits(repositoryNames, username);

  for (let index = 0; index < languages.length; index += 1) {
    if (repositoriesObject[languages[index]] === undefined) {
      repositoriesObject[languages[index]] = 0;
    }
    repositoriesObject[languages[index]] += 1;
  }

  graphLabels = Object.keys(repositoriesObject);
  graphDataSet = Object.values(repositoriesObject);

  // use b - a for desc order and a - b for asc order
  graphLabels.sort((a, b) => {
    return repositoriesObject[b] - repositoriesObject[a];
  });

  sortArrayInDescendingOrder(graphDataSet);

  createNewBarGraph(repoGraphContainer, graphTitle, graphLabels, graphDataSet);
}

/**
 * Function name: getApis
 * @param {string} username - GitHub username
 * Creates graph of contribitions with API's
 */
function getApis(username) {
  const url = chrome.runtime.getURL('result.json');

  fetch(url)
    .then((response) => response.json())
    .then((json) => createApiGraph(json, username));
}

/**
 * Function name: createApiGraph
 * @param {JSON} userData - GitHub user api data
 * creates graph on user profile card about langauges and apis
 */
function createApiGraph(userData, username) {
  const apiGraphContainer = document.getElementById('commitsGraph');
  const apiGraphTitle = `Total commits per api for ${username}`;
  const MAX_COUNT = 10;
  const apiTitles = [];
  const apiTotals = [];
  const languages = [];

  let total = 0;

  userData.Repos.forEach((index) => {
    index.API.apis.forEach((api) => {
      if (total < MAX_COUNT) {
        apiTitles.push(api.name);
        apiTotals.push(api.count);
        total += 1;
      }
    });

    index.API.langs.forEach((language) => {
      languages.push(language);
    });
  });

  sortArrayInDescendingOrder(apiTitles);

  sortArrayInDescendingOrder(apiTotals);

  createNewBarGraph(apiGraphContainer, apiGraphTitle, apiTitles, apiTotals);
}

/**
 * Function createNewBarGraph
 * @param {string} container - container to append new chart
 * @param {string} graphTitle - title of graph
 * @param {[string]} graphLabels - labels for each bar in graph
 * @param {[int]} graphData - data points for each bar in graph
 */
function createNewBarGraph(container, graphTitle, graphLabels, graphData) {
  const colors = [
    '#00498D',
    '#01579B',
    '#00498D',
    '#0277BD',
    '#0288D1',
    '#039BE5',
    '#03A9F4',
    '#29B6F6',
    '#4FC3F7',
    '#81D4FA',
    '#B3E5FC',
  ];

  const barGraph = new Chart(container, {
    type: 'bar',
    data: {
      labels: graphLabels,
      datasets: [
        {
          label: 'Commits',
          backgroundColor: colors,
          data: graphData,
        },
      ],
    },
    options: {
      responsive: false,
      legend: { display: false },
      title: {
        display: true,
        text: graphTitle,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontSize: 8,
              callback(value) {
                if (value.length > 4) {
                  return `${value.substr(0, 4)}...`;
                }
                return value;
              },
            },
          },
        ],
      },
      animation: {
        duration: 1,
        onProgress() {
          const chartInstance = this.chart;
          const { ctx } = chartInstance;

          ctx.font = Chart.helpers.fontString(
            Chart.defaults.global.defaultFontSize,
            Chart.defaults.global.defaultFontStyle,
            Chart.defaults.global.defaultFontFamily
          );
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach((dataset, dataIndex) => {
            const meta = chartInstance.controller.getDatasetMeta(dataIndex);
            meta.data.forEach((bar, index) => {
              if (dataset.data[index] > 0) {
                const data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y);
              }
            });
          });
        },
      },
    },
  });
}

/**
 * Listen to changes from background script
 */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.message === 'progress_bar') {
    $('.progressbar').toggleClass('hiddenDisplay');
  } else if (msg.message === 'icon') {
    $('.helpIcon').toggleClass('hiddenDisplay');
  } else if (msg.message === 'ribbon') {
    $('.successRibbon').toggleClass('hiddenDisplay');
  } else if (msg.type === 'CHECK_URL') {
    if (checkIsEditingForkedFile()) {
      createForkedFileToolTips();
    }
  }
});
