class ToolTip {
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

  insertIconBeforeElement() {
    $(this.toolTipElement).insertBefore(this.gitHubElement);
  }

  insertIconAfterElement() {
    $(this.toolTipElement).insertAfter(this.gitHubElement);
  }
}

/**
 * Object for creating plugin content
 */
const plugin = {
  currentPageUrl: document.location.pathname,
  injectedContent: false,
  addedNewComment: false,
  oAuthToken: '32921960607cb6a5861f9e2f01d46b37e34238ee',

  /**
   * Function name: checkCurrentBrowser
   * Checks current browser to determine which browser api to use
   */
  currentBrowser: () => {
    // Get the user-agent string
    const userAgentString = navigator.userAgent;
    const index = 0;

    const browsers = {
      chromeAgent: userAgentString.indexOf('Chrome') > -1,
      IExplorerAgent: userAgentString.indexOf('MSIE') > -1 || userAgentString.indexOf('rv:') > -1,
      firefoxAgent: userAgentString.indexOf('Firefox') > -1,
      safariAgent: userAgentString.indexOf('Safari') > -1,
      operaAgent: userAgentString.indexOf('OP') > -1,
    };

    // Discard Safari since it also matches Chrome
    if (browsers.chromeAgent && browsers.safariAgent) browsers.safariAgent = false;

    // Discard Chrome since it also matches Opera
    if (browsers.chromeAgent && browsers.operaAgent) browsers.chromeAgent = false;

    const browsersNames = Object.keys(browsers);

    const filtered = browsersNames.filter((browser) => {
      return browsers[browser];
    });

    return filtered[index];
  },

  /**
   * Function name: checkUrl
   * Checks the windows current URL to determine which tooltips to display
   */
  checkUrl: () => {
    const urlArray = [
      {
        name: '/edit/',
        runFunction: createFileEditorToolTips,
      },
      {
        name: '/compare/',
        runFunction: createConfirmPullRequestToolTips,
      },
      {
        name: '/pull/',
        runFunction: createReviewPullRequestToolTips,
      },
      {
        name: '/upload/',
        runFunction: updateUploadPage,
      },
      {
        name: '/blob/',
        runFunction: updateViewFilePage,
      },
    ];

    try {
      const foundUrl = urlArray.find((object) => plugin.currentPageUrl.includes(object.name));
      foundUrl.runFunction();
    } catch (error) {
      if (document.getElementsByClassName('h-card').length !== 0) {
        updateProfileCard();
      }
    }
  },
};

window.onload = () => {
  if (!plugin.injectedContent) {
    plugin.injectedContent = true;
    plugin.currentPageUrl = document.location.pathname;
    plugin.checkUrl();
  }
};

/**
 * Object for monitoring progress of the pull request process
 */
const pullRequestProcess = {
  steps: ['Edit File', 'Confirm Pull Request', 'Pull Request Opened'],
  currentStep: 2,
  totalSteps: 3,
  notRunning: true,

  setCurrentStep: (newStep) => {
    pullRequestProcess.currentStep = newStep;
  },

  getCurrentStep: () => {
    return pullRequestProcess.currentStep;
  },
};

/**
 * Function name: createFileEditorToolTips
 * Adds tooltips when editing files (First step)
 */
function createFileEditorToolTips() {
  pullRequestProcess.currentStep = 1;

  // progress bar above editor
  addProgressBar(
    pullRequestProcess.currentStep,
    pullRequestProcess.totalSteps,
    '.js-blob-form',
    pullRequestProcess.steps
  );

  if (document.getElementsByClassName('flash-messages ')[0] !== null) {
    $('.flash-messages').addClass('text-center');
    document.getElementsByClassName('flash')[0].innerText =
      'You are now editing the file, make your changes below and press the green button to continue';
  }

  // icon to right of file name input
  const fileNameChangeIconText =
    'This is the file name, changing it will create a new file with the new name.';

  const breadCrumbDiv = '.d-md-inline-block';

  const fileNameChangeIcon = new ToolTip('H4', 'helpIcon', fileNameChangeIconText, breadCrumbDiv);

  fileNameChangeIcon.createIcon();
  fileNameChangeIcon.insertIconAfterElement();

  // text next to commit title input
  const inputTitleLabel = document.createElement('h3');
  inputTitleLabel.innerHTML = 'Insert a title here';
  inputTitleLabel.className = 'label-margin-right';

  $(inputTitleLabel).insertBefore('#commit-summary-input');

  // icon next to commit title input
  const commitMessageIconText =
    'This is the title of the pull request. Give a brief description of the change. Be short and objective.';

  const commitMessageIcon = new ToolTip(
    'H4',
    'helpIcon',
    commitMessageIconText,
    '#commit-summary-input'
  );

  commitMessageIcon.createIcon();
  commitMessageIcon.insertIconAfterElement();

  // text next to commit description input
  const inputDescriptionLabel = document.createElement('h3');
  inputDescriptionLabel.innerHTML = 'Insert a <br> description here';
  inputDescriptionLabel.className = 'label-margin-right';

  $(inputDescriptionLabel).insertBefore('#commit-description-textarea');

  // icon next to commit description input
  const extendedDescIconText =
    'Add a more detailed description of the pull request if needed. Here you can present your arguments and reasoning that lead to change.';

  const extendedDescIcon = new ToolTip(
    'H4',
    'helpIcon',
    extendedDescIconText,
    '#commit-description-textarea'
  );

  extendedDescIcon.createIcon();
  extendedDescIcon.insertIconAfterElement();

  // icon next to commit and cancel buttons
  let submitChangesIconText =
    'By clicking the Commit Changes button the changes will automatically be pushed to the repo';

  const buttonText = document.getElementsByClassName('btn-primary')[1].innerText;

  if (buttonText === 'Propose changes') {
    submitChangesIconText =
      'By clicking the Propose changes button you will start the pull request submission process. You will have the chance to check your changes before finalizing it.';
  }

  const submitChangesIcon = new ToolTip('H4', 'helpIcon', submitChangesIconText, '#submit-file');

  submitChangesIcon.createIcon();
  submitChangesIcon.toolTipElement.style.marginRight = '20px';
  submitChangesIcon.insertIconBeforeElement();

  $('input[name="commit-choice"]').click(() => {
    const pullChangesText =
      'By clicking the Propose changes button you will start the pull request submission process. You will have the chance to check your changes before finalizing it.';

    const directCommitText =
      'By clicking the Commit Changes button the changes will be directly pushed to the repo';

    $('.helpIconText:eq(3)').toggleText(directCommitText, pullChangesText);
  });
}

/**
 * Function name: createConfirmPullRequestToolTips
 * Creates tooltips when confirming a change to file (Second step)
 */
function createConfirmPullRequestToolTips() {
  pullRequestProcess.currentStep = 2;

  addProgressBar(
    pullRequestProcess.currentStep,
    pullRequestProcess.totalSteps,
    '.repository-content',
    pullRequestProcess.steps
  );

  // change placeholder of pull request comment input
  const newPullRequestPlaceHolderText =
    'You can add a more detailed description of the pull request here if needed.';

  $('#pull_request_body').attr('placeholder', newPullRequestPlaceHolderText);

  let isComparingBranch = false;

  if (document.getElementsByClassName('branch-name').length > 0) {
    isComparingBranch = true;
  }

  // change header of different element when comparing a branch pull request
  if (isComparingBranch) {
    $('.Subhead-heading').text('Create Pull Request');
  }

  // change header in top of editor
  const pullRequestTitle = document.getElementsByClassName('Subhead-heading')[1];
  pullRequestTitle.innerHTML = 'Create pull request';

  // adjust width of navbar for new icon element
  const topRibbon = document.getElementsByClassName('js-range-editor')[0];
  topRibbon.style.width = '93%';
  topRibbon.style.display = 'inline-block';

  // icon next to current branch and new pull request branch name
  const currentBranchIconIconText =
    'This represents the origin and destination of your pull request.';
  const currentBranchIcon = new ToolTip(
    'H4',
    'helpIcon',
    currentBranchIconIconText,
    '.js-range-editor:eq(0)'
  );

  currentBranchIcon.createIcon();
  currentBranchIcon.insertIconAfterElement();

  // move button row to left side of editor
  if (!isComparingBranch) {
    const buttonRow = document.getElementsByClassName('d-flex flex-justify-end m-2')[0];
    buttonRow.classList.remove('flex-justify-end');
    buttonRow.classList.add('flex-justify-start');
  }

  // icon next to create pull request button
  const createPullRequestButtonIconText =
    'By clicking this button you will create the pull request to allow others to view your changes and accept them into the repository.';

  const submitButtonClass = '.js-pull-request-button';

  const createPullRequestButtonIcon = new ToolTip(
    'H4',
    'helpIcon',
    createPullRequestButtonIconText,
    submitButtonClass
  );

  createPullRequestButtonIcon.createIcon();
  createPullRequestButtonIcon.insertIconAfterElement();

  // override the container width and display to add icon
  const numbersSummaryContainer = document.getElementsByClassName('files-bucket')[0];
  numbersSummaryContainer.style.width = '93%';
  numbersSummaryContainer.style.display = 'inline-block';

  // icon above summary of changes and commits
  const requestSummaryIconText =
    'This shows the amount of commits in the pull request, the amount of files you changed in the pull request, how many comments were on the commits for the pull request and the ammount of people who worked together on this pull request.';

  const summaryClass = '.overall-summary';

  const requestSummaryIcon = new ToolTip('H4', 'helpIcon', requestSummaryIconText, summaryClass);

  requestSummaryIcon.createIcon();
  requestSummaryIcon.toolTipElement.style = 'float:right;';
  requestSummaryIcon.insertIconAfterElement();

  // adjust width of github container for new icon element
  const commitSummaryContainer = document.getElementsByClassName('details-collapse')[0];

  commitSummaryContainer.style.width = '93%';
  commitSummaryContainer.style.display = 'inline-block';

  // icon above container for changes in current pull request
  const comparisonIconText =
    'This shows the changes between the orginal file and your version. Green(+) represents lines added. Red(-) represents removed lines';

  const comparisonClass = '.details-collapse';

  const comparisonIcon = new ToolTip('H4', 'helpIcon', comparisonIconText, comparisonClass);

  comparisonIcon.createIcon();

  comparisonIcon.insertIconAfterElement();
}

/**
 * Function name: createReviewPullRequestToolTips
 * Adds tooltips when reviewing a pull request (Final step)
 */
function createReviewPullRequestToolTips() {
  pullRequestProcess.currentStep = 3;

  const BUTTONS_IN_REPO = 2;

  const steps = ['Edit File', 'Confirm Pull Request', 'Pull Request Opened'];

  addProgressBar(3, 3, '.gh-header-show', steps);

  const pullRequestName = document.getElementsByClassName('js-issue-title')[0].innerText;

  const pullRequestStatusIconText =
    'This indicates that the pull request is open meaning someone will get to it soon.';

  const pullRequestState = $('.State:eq(0)').text().trim();

  if (pullRequestState !== 'Closed') {
    const pullRequestStatusIcon = new ToolTip(
      'H4',
      'helpIcon',
      pullRequestStatusIconText,
      '.State:eq(0)'
    );

    pullRequestStatusIcon.createIcon();
    pullRequestStatusIcon.toolTipElement.style.marginLeft = '10px';
    pullRequestStatusIcon.toolTipElement.style.marginRight = '10px';
    pullRequestStatusIcon.insertIconAfterElement();
  }

  $('.tabnav-tabs:eq(0)').addClass('overflow-visible');
  $('.tabnav-tabs:eq(0)').removeClass('overflow-auto');

  const pullRequestNavIconText =
    'Feel free to explore this menu, you can discuss with project contributors, see the commits made, check the review status and see the files changed.';

  const pullRequestNavIcon = new ToolTip(
    'H4',
    'helpIcon',
    pullRequestNavIconText,
    '.tabnav-tab:eq(3)'
  );

  pullRequestNavIcon.createIcon();
  pullRequestNavIcon.insertIconAfterElement();

  $('.helpIconText:eq(1)').width(250);

  const directlyMentionIcon = $('[aria-label="Directly mention a user or team"]');
  directlyMentionIcon.attr('aria-label', 'Use "@" to mention a project contributor.');

  if (document.location.pathname.includes('/files')) {
    addFileHistoryLink();
  }

  // check if the close pull request and comment buttons are present in page
  if ($('.form-actions > button').length === BUTTONS_IN_REPO) {
    const closePullRequestIconText =
      'This will close the pull request meaning people cannot view this! Do not click close unless the request was solved.';

    const requestButtonsClass = '.bg-gray-light:eq(4)';

    const closePullRequestIcon = new ToolTip(
      'H4',
      'helpIcon',
      closePullRequestIconText,
      requestButtonsClass
    );

    closePullRequestIcon.createIcon();

    closePullRequestIcon.insertIconBeforeElement();

    closePullRequestIcon.toolTipElement.style.marginRight = '20px';
  }

  const submitButtons = document.getElementsByClassName('d-flex flex-justify-end')[0];
  submitButtons.classList.remove('flex-justify-end');
  submitButtons.classList.add('flex-justify-start');

  $('button[name="comment_and_close"]').click((event) => {
    if (!confirm(`Are you sure that you want to close the pull request: ${pullRequestName}?`)) {
      event.preventDefault();
    }
  });

  $('button:contains("Comment")').click(() => {
    chrome.storage.sync.set({ hasSubmittedMessage: true });

    createSuccessRibbon();
  });
}

/**
 * Function name: sortArrayInDescendingOrder
 * @param {int} array - array to be sorted
 * Sorts given array in descending order
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
 * Edits pencil label when viewing a file in a repository that you are not a contributor of
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
 * Creates ribbon above progress bar to know the process is successful
 */
async function createSuccessRibbon() {
  let ribbonMessage;

  const hasSubmittedMessage = await checkIfMessageSubmitted();

  if (document.location.pathname.includes('/pull')) {
    const successRibbonContainer = document.createElement('div');
    successRibbonContainer.className = 'successRibbon text-center';

    ribbonMessage = 'The pull request was created successfully and will be reviewed shortly';

    const ribbonTextNode = document.createTextNode(ribbonMessage);

    successRibbonContainer.appendChild(ribbonTextNode);

    $(successRibbonContainer).insertBefore('.container');
  }

  if (hasSubmittedMessage) {
    const successRibbonContainer = document.createElement('div');
    successRibbonContainer.className = 'successRibbon text-center';

    ribbonMessage = `The mentioned user will receive a notification and may help you work on the pull request.`;

    const ribbonTextNode = document.createTextNode(ribbonMessage);

    successRibbonContainer.appendChild(ribbonTextNode);

    $(successRibbonContainer).insertBefore('.container');
  }

  /*
  if (hasSubmittedMessage) {
    chrome.storage.sync.set({ hasSubmittedMessage: false });
  }
  */
}

/**
 * Function name: checkIfMessageSubmitted
 * Returns if the user recently submitted a message to a pull request or not
 */
async function checkIfMessageSubmitted() {
  const hasSubmittedMessage = new Promise((resolve) => {
    chrome.storage.sync.get('hasSubmittedMessage', (result) => {
      resolve(result.hasSubmittedMessage);
    });
  });

  return hasSubmittedMessage;
}
/**
 * Custom jQuery function to toggle text
 */
$.fn.extend({
  toggleText(firstElement, secondElement) {
    return this.text(this.text() === secondElement ? firstElement : secondElement);
  },
});

/**
 * Function name: addFileHistoryLink
 * Appends new option to dropdown when reviewing files in pull request
 */
function addFileHistoryLink() {
  // update three dots to appear as a button

  const buttonContainers = document.getElementsByClassName('height-full');
  let index;

  for (index = 3; index < buttonContainers.length; index += 2) {
    const newButton = document.createElement('span');
    newButton.className = 'btn btn-primary';
    newButton.id = 'moreOptionsButton';

    newButton.innerHTML = 'More Options';

    $('.octicon-kebab-horizontal').remove();

    $(`.height-full:eq(${index})`).append(newButton);
  }

  const fileHistoryLink = document.createElement('a');
  fileHistoryLink.className = 'pl-5 dropdown-item btn-link';
  fileHistoryLink.id = 'fileHistoryLink';
  fileHistoryLink.innerHTML = 'File history';

  const repositoryOwner = $('a[rel="author"]').text();
  const repositoryName = $('a[data-pjax="#js-repo-pjax-container"]').text();
  const fileName = $('.file-info:eq(0) > .link-gray-dark:eq(0)').text();

  fileHistoryLink.href = `https://github.com/${repositoryOwner}/${repositoryName}/commits/master/${fileName}`;

  $(fileHistoryLink).insertBefore('.dropdown-item:eq(33)');
}

/**
 * Function name: updateProfileCard
 * Updates contribution graph to show icon to toggle between graphs
 */
function updateProfileCard() {
  const toggleButton = document.createElement('button');
  toggleButton.className = 'btn btn-primary mb-3 ml-md-3 toggleBtn';
  toggleButton.innerText = 'Show more information';

  const username = document.getElementsByClassName('vcard-username')[0].innerHTML;

  try {
    createCardContainer();

    getRepos(username);

    getApis(username);

    $(toggleButton).insertAfter('.contrib-footer ');
  } catch (error) {
    // do nothing
  }

  $('.toggleBtn').click(() => {
    $('.toggleBtn').toggleText('Show more information', 'X');

    $('.toggleBtn').toggleClass('closeButton');
    $('.toggleBtn').toggleClass('btn-primary');
    $('.toggleBtn').toggleClass('ml-md-3');

    $('.back').toggleClass('hovered');

    $('#js-contribution-activity').toggleClass('hidden');
    $('#user-activity-overview').toggleClass('hidden');
  });
}

/**
 * Function name: createCardContainer
 * Creates structure of profile overview with graphs
 */
function createCardContainer() {
  const outerContainer = document.getElementsByClassName('graph-before-activity-overview')[0];

  try {
    outerContainer.className += ' card-container';

    const cardBack = document.createElement('div');
    cardBack.className = 'back';

    cardBack.innerHTML = `<div class="link-row">
                          <button class="btn btn-primary btn-blck mb-3 complete-list-link">View all information here</button>
                        </div>
                        <canvas class="graph" id="reposChart"></canvas>
                        <canvas class="graph" id="skillGraph"></canvas>
                        <canvas class="graph" id="commitsGraph"></canvas>
                        <canvas class="graph" id="languagesGraph"></canvas>`;

    outerContainer.appendChild(cardBack);
  } catch (error) {
    throw new Error("Can't append new container");
  }

  $('.complete-list-link').click(() => {
    const currentBrowser = plugin.currentBrowser();

    const githubUsername = document.getElementsByClassName('vcard-username')[0].innerHTML;

    if (currentBrowser.includes('chrome')) {
      chrome.storage.sync.set({ username: githubUsername });

      chrome.runtime.sendMessage({
        type: 'OPEN_COMPLETE_OVERVIEW',
      });
    } else {
      browser.storage.set({ username: githubUsername });
      browser.runtime.sendMessage({
        type: 'OPEN_COMPLETE_OVERVIEW',
      });
    }
  });
}

/**
 * Function name: getCommits
 * @param {string} username - GitHub username for API
 * Uses GitHub API to view commit totals for user
 */
async function getCommits(repositories, username) {
  const skillGraphContainer = document.getElementById('skillGraph');

  const apiHeader = {
    Authorization: `Token ${plugin.oAuthToken}`,
  };

  const repoObject = {};

  let total = 0;

  for (const repo of repositories) {
    if (total < 10) {
      const commitUrl = `https://api.github.com/repos/${username}/${repo}/commits?page=1&per_page=25`;

      const commitResponse = await fetch(commitUrl, {
        method: 'GET',
        headers: apiHeader,
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
  const repoGraphContainer = document.getElementById('reposChart');
  const MAX_COUNT = 10;

  const languages = [];
  const repositoryNames = [];
  const repositoriesObject = {};

  const apiHeader = {
    Authorization: `Token ${plugin.oAuthToken}`,
  };

  const url = `https://api.github.com/users/${username}/repos`;
  const response = await fetch(url, {
    method: 'GET',
    headers: apiHeader,
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

  sortArrayInDescendingOrder(graphLabels);
  sortArrayInDescendingOrder(graphDataSet);

  createNewBarGraph(repoGraphContainer, graphTitle, graphLabels, graphDataSet);
}

/**
 * Function name: getApis
 * @param {string} username - GitHub username
 * Creates graph of contribitions with API's
 */
function getApis(username) {
  const url = chrome.runtime.getURL('data/result.json');

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
 * Function name: createNewBarGraph
 * @param {string} container - container to append new chart
 * @param {string} graphTitle - title of graph
 * @param {string} graphLabels - labels for each bar in graph
 * @param {int} graphData - data points for each bar in graph
 * Creates new bar graph and appends to canvas in DOM
 */
function createNewBarGraph(container, graphTitle, graphLabels, graphData) {
  const barGraph = new Chart(container, {
    type: 'bar',
    data: {
      labels: graphLabels,
      datasets: [
        {
          label: 'Commits',
          backgroundColor: 'rgb(64, 196, 99)',
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
 * Function name: updateUploadPage
 * Updates page when uploading a file to a repository
 */
function updateUploadPage() {
  if ($('.blankslate p:first').text() === 'File uploads require push access to this repository.') {
    $('.blankslate p:first').text(
      'In order to upload files, click the fork button on the upper right'
    );

    const forkRepoText = document.getElementsByClassName('px-4 py-2').textContent;

    // Change the fork button to be green to let the user know they can fork the repo
    if (forkRepoText !== `You've already forked ResearchPlugin`) {
      $('.btn-with-count:eq(3)').addClass('btn-primary');
    }
  }
  const commitTitleIcon = new ToolTip(
    'H4',
    'helpIcon',
    'This is the title of the commit. Give a brief description of the change. Be short and objective.',
    '.js-new-blob-commit-summary'
  );

  commitTitleIcon.createIcon();

  $(commitTitleIcon.toolTipElement).insertAfter(commitTitleIcon.gitHubElement);

  const commitDescription = new ToolTip(
    'H4',
    'helpIcon',
    'Add a more detailed description of the commit if needed. Here you can describe the files uploaded.',
    '.comment-form-textarea'
  );

  commitDescription.createIcon();

  $(commitDescription.toolTipElement).insertAfter(commitDescription.gitHubElement);

  $('button[data-edit-text="Commit changes"]').click(() => {
    chrome.storage.sync.set({ hasUploadedNewFile: true });
  });

  $('button[name="organization"]').click(() => {
    chrome.storage.sync.set({ hasForked: true });
  });
}

/**
 * Function name: updateViewFilePage
 * Adds tooltip when viewing a file in a repository
 */
function updateViewFilePage() {
  const historyLinkIcon = new ToolTip(
    'H4',
    'helpIcon',
    'Use the "History" link <br> to view changes to this <br> file by other contributors.',
    '.ml-3:eq(2)'
  );

  historyLinkIcon.createIcon();

  $(historyLinkIcon.toolTipElement).insertAfter(historyLinkIcon.gitHubElement);
}

/**
 * Listen to changes from background script
 */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'CHECK_URL') {
    if (!plugin.injectedContent) {
      plugin.injectedContent = true;
      plugin.currentPageUrl = document.location.pathname;

      plugin.checkUrl();
    } else if (
      (document.location.pathname.includes('files') &&
        document.location.pathname.includes('pull')) ||
      document.location.pathname.includes('/pull/')
    ) {
      plugin.currentPageUrl = document.location.pathname;
      plugin.injectedContent = true;

      $('.successRibbon').remove();
      $('.helpIcon').remove();
      $('.container').remove();
      $('#moreOptionsButton').remove();
      $('#fileHistoryLink').remove();

      plugin.checkUrl();
    }
    if (checkIsEditingForkedFile()) {
      createForkedFileToolTips();
    }
  } else if (msg.type === 'TOGGLE_EXTENSION') {
    $('.helpIcon').toggleClass('hiddenDisplay');

    $('.successRibbon').toggleClass('hiddenDisplay');

    $('.container').toggleClass('hiddenDisplay');
  }
});
