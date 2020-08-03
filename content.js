const NOT_FOUND = -1;

// array of color values for graphs
const colors = [
  '#3e95cd',
  '#8e5ea2',
  '#3cba9f',
  '#e8c3b9',
  '#c45850',
  '#3e95cd',
  '#8e5ea2',
  '#3cba9f',
  '#e8c3b9',
  '#c45850',
];

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

    const circleIcon = document.createElement('span');
    circleIcon.className = 'helpIconCircle';
    circleIcon.innerHTML = '?';

    const toolTip = document.createElement('span');
    toolTip.className = 'helpIconText';
    toolTip.innerHTML = this.toolTipText;

    toolTipContainer.appendChild(circleIcon);
    toolTipContainer.appendChild(toolTip);

    this.toolTipElement = toolTipContainer;
  }
}

/**
 * Function name: checkURL
 * Checks the windows current URL for keywords to determine which tooltips
 * to display
 */
function checkURL() {
  // check if the user wants to edit a file that they are not an owner of
  if (checkIsEditingForkedFile()) {
    createForkedFileToolTips();
  }
  // if the user is editing a markdown file
  else if (
    window.location.href.indexOf('.md') !== NOT_FOUND &&
    window.location.href.indexOf('edit') !== NOT_FOUND
  ) {
    createFileEditorToolTips();
  }
  // if the user is reviewing a pull request
  else if (window.location.href.indexOf('compare') !== NOT_FOUND) {
    createConfirmPullRequestToolTips();
  } else if (
    window.location.href.indexOf('pull') !== NOT_FOUND &&
    window.location.href.indexOf('quick_pull') === NOT_FOUND
  ) {
    createReviewPullRequestToolTips();
  }
  // if the user is opening a pull request
  else if (document.getElementsByClassName('h-card').length !== 0) {
    updateProfileCard();
  }
  // if the user is creating a new issue
  else if (
    window.location.href.indexOf('issues') !== NOT_FOUND &&
    window.location.href.indexOf('new') !== NOT_FOUND
  ) {
    createReportIssueToolTips();
  } else if (
    window.location.href.indexOf('issues') !== NOT_FOUND &&
    window.location.href.indexOf('new') === NOT_FOUND
  ) {
    createReviewIssueToolTips();
  } else {
    // do nothing
  }
}

checkURL();

/**
 * Function name: checkIsEditingForkedFile
 * Checks if the user is viewing a file that they do not own
 */
function checkIsEditingForkedFile() {
  try {
    // check if there is a pencil icon with this aria label
    return (
      document.getElementsByClassName('tooltipped')[2].getAttribute('aria-label') ===
      'Edit the file in your fork of this project'
    );
  } catch (error) {
    return false;
  }
}

/**
 * Function name: addProgressBar
 * @param {int} currentStep - current step in process
 * @param {int} totalSteps - the total amount of steps in process
 * @param {string} rootElement - className of HTML element that the progress bar
 *                      will be added to
 *  Adds progressBar above forms in GitHub pages to let user how far they are
 * in editing files
 */
function addProgressBar(currentStep, totalSteps, rootElement, stepsList) {
  // create the progress bar element
  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'container';

  const progressBar = document.createElement('div');
  progressBar.className = 'progressbar';

  const itemList = document.createElement('ul');

  let index = 1;

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
 * Function name: isComplete
 * Checks if issue/ pull request was succesfully created and is open in the repo
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
  let processType = '';

  if (window.location.href.indexOf('issues') != NOT_FOUND) {
    processType = 'issue';
  } else {
    processType = 'pull request';
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
 * Adds tooltips to webpage when editing markdown files
 * First step in editing files
 */
function createFileEditorToolTips() {
  const steps = ['Edit File', 'Confirm Pull Request', 'Pull Request Opened'];

  // progress bar above editor
  addProgressBar(1, 3, '.js-blob-form', steps);

  // icon to right of file name input
  const fileNameChangeText =
    'This is the file name, changing it will create a new file with the new name';

  const breadCrumbDiv = '.d-md-inline-block';

  const fileNameChangeIcon = new ToolTipIcon('H4', 'helpIcon', fileNameChangeText, breadCrumbDiv);

  fileNameChangeIcon.createIcon();

  $(fileNameChangeIcon.toolTipElement).insertAfter(fileNameChangeIcon.gitHubElement);

  // banner above commit message input
  const commitTitleText =
    'This is the title. Give a brief description of the change. Be short and objective.';

  const inputTitleLabel = document.createElement('h3');
  inputTitleLabel.innerHTML = 'Insert a title here';
  inputTitleLabel.style.display = 'inline-block';
  inputTitleLabel.style.marginRight = '20px';

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
    'Add a more detailed description if needed. Here you can present your arguments and reasoning that lead to change.';

  const inputDescriptionLabel = document.createElement('h3');
  inputDescriptionLabel.innerHTML = 'Insert a <br> description here';
  inputDescriptionLabel.style.display = 'inline-block';
  inputDescriptionLabel.style.marginRight = '22px';

  $(inputDescriptionLabel).insertBefore('#commit-description-textarea');

  const extendedDescIcon = new ToolTipIcon(
    'H4',
    'helpIcon',
    descriptionText,
    '#commit-description-textarea'
  );

  extendedDescIcon.createIcon();

  $(extendedDescIcon.toolTipElement).insertAfter(extendedDescIcon.gitHubElement);

  const commitChangesDirectlyText =
    'By clicking the Commit Changes button the changes will automatically be pushed to the repo';

  const submitChangesIcon = new ToolTipIcon(
    'H4',
    'helpIcon',
    commitChangesDirectlyText,
    '#submit-file'
  );

  submitChangesIcon.createIcon();

  submitChangesIcon.toolTipElement.style.marginRight = '20px';

  $(submitChangesIcon.toolTipElement).insertBefore(submitChangesIcon.gitHubElement);
}

// On pull request step 1, toggle icon text to help inform user
let onDirectPull = true;
let iconText = '';

const pullChangesText =
  'By clicking the Propose changes button you will start the submission process. You will have the chance to check your changes before finalizing it.';

const directCommitText =
  'By clicking the Commit Changes button the changes will be directly pushed to the repo';

$('input[name="commit-choice"]').click(() => {
  document.getElementsByClassName('helpIcon')[3].remove();

  if (onDirectPull) {
    iconText = pullChangesText;
    onDirectPull = false;
  } else {
    iconText = directCommitText;
    onDirectPull = true;
  }

  const submitChangesIcon = new ToolTipIcon('H4', 'helpIcon', iconText, '#submit-file');

  submitChangesIcon.createIcon();

  submitChangesIcon.toolTipElement.style.marginRight = '20px';

  $(submitChangesIcon.toolTipElement).insertBefore(submitChangesIcon.gitHubElement);
});

/**
 * Function name: createConfirmPullRequestToolTips
 * Adds tooltips to webpage when confirming a change to file
 * Second step in editing markdown files
 */
function createConfirmPullRequestToolTips() {
  const steps = ['Edit File', 'Create Pull Request', 'Pull Request Opened'];

  addProgressBar(2, 3, '.repository-content', steps);

  $('#pull_request_body').attr(
    'placeholder',
    'You can add a more detailed description here if needed.'
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
    'This represents the origin and destination of your changes if you are not sure, leave it how it is, this is common for small changes.';

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
  const buttonRow = document.getElementsByClassName('d-flex flex-justify-end m-2')[0];
  buttonRow.classList.remove('flex-justify-end');
  buttonRow.classList.add('flex-justify-start');

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

  console.log('here');
  setTimeout(changeMergeText, 3000);
  console.log('here2');
}

function changeMergeText() {
  let canMerge = true;
  let mergeText = '';
  try {
    mergeText = document.getElementsByClassName('text-red')[0].innerText;
    console.log(mergeText);
  } catch (error) {
    canMerge = false;
  }
  console.log(canMerge);
  if (mergeText === 'Can’t automatically merge. ') {
    console.log('here');
    $('.text-red').innerHTML(
      'There is a merge conflict, but this can be fixed by creating the pull request'
    );
  }
}
/**
 * Function name: createReviewPullRequestToolTips
 * Adds tooltips to webpage when reviewing pull requests
 * Third step in editing markdown files
 */
function createReviewPullRequestToolTips() {
  const steps = ['Edit File', 'Confirm Pull Request', 'Pull Request Opened'];

  addProgressBar(3, 3, '.gh-header-show', steps);

  const titleTest = 'new'; // document.getElementsByClassName('js-issue-title')[0];

  const branchContainerText =
    'This indicates that the pull request is open meaning someone will get to it soon.';

  const pullRequestStatusIcon = new ToolTipIcon(
    'H4',
    'helpIcon',
    branchContainerText,
    '.js-clipboard-copy'
  );

  pullRequestStatusIcon.createIcon();

  $(pullRequestStatusIcon.toolTipElement).insertAfter(pullRequestStatusIcon.gitHubElement);

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

  /*
  var submitButtons = document.getElementsByClassName('d-flex flex-justify-end')[0];
  submitButtons.classList.remove('flex-justify-end');
  submitButtons.classList.add('flex-justify-start');*/

  $('.js-quick-submit-alternative').click((event) => {
    if (!Confirm(`Are you sure that you want to close the pull request: ${titleTest}?`)) {
      event.preventDefault();
    }
  });
}

/**
 * Function name: createForkedFileToolTips
 * Edits tooltips when viewing a repository that you are not a contributor of
 */
function createForkedFileToolTips() {
  $('.tooltipped-nw:nth-child(2)').attr('aria-label', 'Edit Readme');
}

/**
 * Function name: createReportIssueToolTips
 * Adds tooltips to page when opening a new issue report
 */
function createReportIssueToolTips() {
  const steps = ['Report Issue', 'confirm Issue Report', 'Issue Submitted'];

  // progress bar above editor
  addProgressBar(1, 3, '.new_issue', steps);

  const submitButtonText = 'After clicking this, you will have a chance to update the issue report';

  const submitButtonClass = '.flex-justify-end button:eq(0)';

  const submitButtonIcon = new ToolTipIcon('H4', 'helpIcon', submitButtonText, submitButtonClass);

  submitButtonIcon.createIcon();

  $(submitButtonIcon.toolTipElement).insertAfter(submitButtonIcon.gitHubElement);
}

/**
 * Function name: createReviewIssueToolTips
 * Adds tooltips to page when reviewing a new issue report
 */
function createReviewIssueToolTips() {
  const issueTitle = document.getElementsByClassName('js-issue-title')[0].innerText;

  const steps = ['Report Issue', 'confirm Issue Report', 'Issue Submitted'];

  addProgressBar(3, 3, '.repository-content', steps);

  const buttonRow = document.getElementsByClassName('d-flex flex-justify-end')[0];
  buttonRow.classList.remove('flex-justify-end');
  buttonRow.classList.add('flex-justify-start');

  const closeIssueIconText =
    'This will close the issue request meaning people cannot view this! Do not click close unless the request was solved. ';

  const submitButtonClass = '.flex-justify-end button:eq(0)';

  const submitButtonIcon = new ToolTipIcon('H4', 'helpIcon', closeIssueIconText, submitButtonClass);

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
  const profileCardIconText = 'Click this tooltip to show more info about the user';
  const contributionGraphClass = '.js-calendar-graph';

  const showGraphIcon = new ToolTipIcon(
    'H4',
    'helpIcon graph-tooltip',
    profileCardIconText,
    contributionGraphClass
  );

  const username = document.getElementsByClassName('vcard-username')[0].innerHTML;

  createCardContainer();

  getRepos(username);

  getApis(username);

  showGraphIcon.createIcon();

  $(showGraphIcon.toolTipElement).insertBefore(showGraphIcon.gitHubElement);

  $('.helpIcon').click(() => {
    if ($('.helpIconCircle').text() === '?') {
      $('.helpIconCircle').text('X');
      $('.helpIconText').addClass('removeText');
    } else {
      $('.helpIconCircle').text('?');
      $('.helpIconText').removeClass('removeText');
    }
    $('.back').toggleClass('hovered');
    $('#js-contribution-activity').toggleClass('hidden');
    $('#user-activity-overview').toggleClass('hidden');
  });
}

/**
 * Function: createCardContainer
 * Creates structure of profile overview with graphs
 */
function createCardContainer() {
  const outerContainer = document.getElementsByClassName('graph-before-activity-overview')[0];

  outerContainer.className += ' card-container';

  const cardBack = document.createElement('div');
  cardBack.className = 'back';

  const externalLinkContainer = document.createElement('div');
  externalLinkContainer.className = 'link-row';

  const externalLinkTitle = document.createElement('h4');
  externalLinkTitle.appendChild(document.createTextNode('View all information'));

  const externalLink = document.createElement('span');
  externalLink.className = 'complete-list-link';
  externalLink.appendChild(document.createTextNode(' here'));

  externalLinkTitle.appendChild(externalLink);
  externalLinkContainer.appendChild(externalLinkTitle);

  const repoGraph = document.createElement('canvas');
  repoGraph.className = 'graph';
  repoGraph.id = 'myChart';

  const skillGraph = document.createElement('canvas');
  skillGraph.className = 'graph';
  skillGraph.id = 'skillGraph';

  const commitsGraph = document.createElement('canvas');
  commitsGraph.className = 'graph';
  commitsGraph.id = 'commitsGraph';

  const languagesGraph = document.createElement('canvas');
  languagesGraph.className = 'graph';
  languagesGraph.id = 'languagesGraph';

  cardBack.appendChild(externalLinkContainer);
  cardBack.appendChild(repoGraph);
  cardBack.appendChild(skillGraph);
  cardBack.appendChild(commitsGraph);
  cardBack.appendChild(languagesGraph);

  outerContainer.appendChild(cardBack);
}

$('.complete-list-link').click(() => {
  const username = document.getElementsByClassName('vcard-username')[0].innerHTML;

  chrome.storage.sync.set({ username: username });

  chrome.runtime.sendMessage({
    type: 'ACTIVITY_HISTORY_READY',
  });
});

/**
 * function getCommits
 * @param {string} username - GitHub username for API
 * Uses GitHub API to view commit totals for user
 */
async function getCommits(repositories, username) {
  const oAuthToken = '2e52399ba6855793a8829ce53966012162665344';

  const headers = {
    Authorization: `Token ${oAuthToken}`,
  };

  const repoObject = {};
  const ctx = document.getElementById('repositories');
  const skillGraphContainer = document.getElementById('skillGraph');
  let total = 0;

  for (const repo of repositories) {
    if (total < 10) {
      const commitUrl = `https://api.github.com/repos/${username}/${repo}/commits?page=1&per_page=25`;

      const commitResponse = await fetch(commitUrl, {
        method: 'GET',
        headers: headers,
      });

      let commitResult = await commitResponse.json();
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

  commitGraph = new Chart(skillGraphContainer, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Commits',
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
        text: `Commits per repository for:  ${username}`,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              max: 30,
              stepSize: 1,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontSize: 8,
              callback: function (value) {
                if (value.length > 4) {
                  return value.substr(0, 4) + '...'; //truncate
                } else {
                  return value;
                }
              },
            },
          },
        ],
      },
      animation: {
        duration: 1,
        onProgress: function () {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;

          ctx.font = Chart.helpers.fontString(
            Chart.defaults.global.defaultFontSize,
            Chart.defaults.global.defaultFontStyle,
            Chart.defaults.global.defaultFontFamily
          );
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              if (dataset.data[index] > 0) {
                var data = dataset.data[index];
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
 * function getRepos
 * @param {string} username - GitHub username for API
 * Uses GitHub API to view programming languages for user
 */
async function getRepos(username) {
  const oAuthToken = '2e52399ba6855793a8829ce53966012162665344';

  const url = `https://api.github.com/users/${username}/repos`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Token ${oAuthToken}`,
    },
  });

  const result = await response.json();

  const languages = [];
  const repositoryNames = [];
  let labels = {};
  let dataSet = {};

  let total = 0;

  result.forEach((index) => {
    if (index.language != null && total < 10) {
      languages.push(index.language);
      repositoryNames.push(index.name);
      total += 1;
    }
  });

  getCommits(repositoryNames, username);

  const repoGraphContainer = document.getElementById('myChart');

  const repositoriesObject = {};

  for (let index = 0; index < languages.length; index += 1) {
    if (!repositoriesObject[languages[index]]) {
      repositoriesObject[languages[index]] = 0;
    }
    repositoriesObject[languages[index]] += 1;
  }

  labels = Object.keys(repositoriesObject);
  dataSet = Object.values(repositoriesObject);

  // use b - a for desc order and a - b for asc order
  labels.sort((a, b) => {
    return repositoriesObject[b] - repositoriesObject[a];
  });

  sortArrayInDescendingOrder(dataSet);

  repositoryGraph = new Chart(repoGraphContainer, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Repositories',
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
        text: `Programming languge totals for ${username}'s repositories`,
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
      },
      animation: {
        duration: 1,
        onProgress: function () {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;

          ctx.font = Chart.helpers.fontString(
            Chart.defaults.global.defaultFontSize,
            Chart.defaults.global.defaultFontStyle,
            Chart.defaults.global.defaultFontFamily
          );
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              if (dataset.data[index] > 0) {
                var data = dataset.data[index];
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
 * Function name: getApis
 * @param {string} username - GitHub username
 * Creates graph of contribitions with API's
 */
function getApis(username) {
  const url = chrome.runtime.getURL('result.json');

  fetch(url)
    .then((response) => response.json()) // assuming file contains json
    .then((json) => createApiGraph(json, username));
}

/**
 * Function name: createApiGraph
 * @param {JSON} userData - GitHub user api data
 * creates graph on user profile card about langauges and apis
 */
function createApiGraph(userData, username) {
  const apiGraphContainer = document.getElementById('commitsGraph');

  const apis = [];
  const apiTotals = [];

  const languages = [];

  let total = 0;

  userData.Repos.forEach((index) => {
    index.API.apis.forEach((api) => {
      if (total < 10) {
        apis.push(api.name);
        apiTotals.push(api.count);
        total += 1;
      }
    });

    index.API.langs.forEach((language) => {
      languages.push(language);
    });
  });

  sortArrayInDescendingOrder(apis);

  sortArrayInDescendingOrder(apiTotals);

  apiGraph = new Chart(apiGraphContainer, {
    type: 'bar',
    data: {
      labels: apis,
      datasets: [
        {
          label: 'Total Commits: ',
          data: apiTotals,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: false,
      legend: { display: false },
      title: {
        display: true,
        text: `Total commits per api for ${username}`,
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
              callback: function (value) {
                if (value.length > 4) {
                  return value.substr(0, 4) + '...';
                } else {
                  return value;
                }
              },
            },
          },
        ],
      },
      animation: {
        duration: 1,
        onProgress: function () {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;

          ctx.font = Chart.helpers.fontString(
            Chart.defaults.global.defaultFontSize,
            Chart.defaults.global.defaultFontStyle,
            Chart.defaults.global.defaultFontFamily
          );
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              if (dataset.data[index] > 0) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y);
              }
            });
          });
        },
      },
    },
  });
}

function sortArrayInDescendingOrder(array) {
  array.sort((a, b) => {
    return b - a;
  });
}

function manageProgressBar() {
  $('.progressbar').toggleClass('hiddenDisplay');
}

function manageIcons() {
  $('.helpIcon').toggleClass('hiddenDisplay');
}

function manageRibbon() {
  $('.successRibbon').toggleClass('hiddenDisplay');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'progress_bar') {
    manageProgressBar();
  } else if (request.message === 'icon') {
    manageIcons();
  } else if (request.message === 'ribbon') {
    manageRibbon();
  }
});
