let NOT_FOUND = -1;

class toolTip {
  constructor(htmlElement, htmlElementClass, htmlElementText, gitHubClass) {
    this.htmlElement = htmlElement;
    this.htmlElementClass = htmlElementClass;
    this.htmlElementText = htmlElementText;
    this.gitHubClass = gitHubClass;
  }

  // create the html element in the page with the given className
  createElement() {
    this.htmlElement = document.createElement(this.htmlElement);
    this.htmlElement.className = this.htmlElementClass;
  }
}

class ToolTipIcon {
  constructor(toolTipElement, toolTipClass, toolTipText, gitHubClassIcon) {
    this.toolTipElement = toolTipElement;
    this.toolTipClass = toolTipClass;
    this.toolTipText = toolTipText;
    this.gitHubClassIcon = gitHubClassIcon;
  }

  createIcon() {
    this.toolTipElement = document.createElement(this.toolTipElement);
    this.toolTipElement.className = this.toolTipClass;
    this.toolTipElement.innerHTML = "?";
    this.toolTipElement.setAttribute("data-tooltip", this.toolTipText);
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
  } else {
    console.log("not found");
  }
}

/**
 * Function name: appendNodeInBody
 * Appends node above the first element in each class
 * @param className: string for container where the new node will be added
 * @param node: new element created in document to be added in container
 * @param nodeText: string to be added to node container
 */
function appendChildBeforeElement(className, node, nodeText) {
  var textNode = document.createTextNode(nodeText);

  // Add the text to the node if any
  node.appendChild(textNode);

  var parentElement = document.getElementsByClassName(className)[0];

  parentElement.appendChild(node);

  parentElement.insertBefore(node, parentElement.firstChild);
}

/**
 * Function name: appendChildToElement
 * Accepts a node and appends it as a child to the first element
 * with the matching class name with the text parameter to display to the user
 * @param className: string for container where the new node will be added
 * @param node: new element created in document to be added in container
 * @param nodeText: string to be added to node container
 */
function appendChildToElement(className, node, nodeText) {
  var textNode = document.createTextNode(nodeText);

  node.appendChild(textNode);

  document.getElementsByClassName(className)[0].appendChild(node);
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
function addProgressBar(currentStep, totalSteps, rootElement) {
  // Get the total progress percentage as a float
  var totalProgress = (currentStep / totalSteps) * 100;

  // create the progress bar element
  var progressBarStatus = document.createElement("div");
  progressBarStatus.className = "progress_status";

  var progressBar = document.createElement("div");

  // check if the user is not in the last page of the process
  if (totalProgress < 100) {
    progressBar.className = "progressBar progressBarPartial";
  } else {
    progressBar.className = "progressBar";
  }

  progressBarStatus.appendChild(progressBar);

  appendChildBeforeElement(rootElement, progressBarStatus, "");

  updateProgressBar();

  // creates progress bar animation and updates current progress
  function updateProgressBar() {
    var progressBarDiv = document.getElementsByClassName("progressBar")[0];
    var width = 1;
    var identity = setInterval(scene, 10);
    function scene() {
      if (width >= 100 || width >= totalProgress) {
        clearInterval(identity);
      } else {
        width++;
        progressBarDiv.style.width = width + "%";
      }
    }

    progressBarDiv.innerHTML = "Step " + currentStep + " out of " + totalSteps;
  }
}

/**
 * Function name: addReadMeToolTips
 * Adds tooltips to webpage when editing markdown files
 * First step in editing markdown files
 */
function addReadMeToolTips() {
  // progress bar above editor
  addProgressBar(1, 3, "js-blob-form");

  // icon to right of file name input
  var fileNameChangeText =
    "This is the file name, changing it will create " +
    " a new file with the new name";

  var breadCrumbDiv =
  '.d-md-inline-block';

  let fileNameChangeIcon = new ToolTipIcon(
    "H4",
    "tooltip2",
    fileNameChangeText,
    breadCrumbDiv
  );

  fileNameChangeIcon.createIcon();
  console.log(fileNameChangeIcon);

  $(fileNameChangeIcon.toolTipElement).insertAfter(fileNameChangeIcon.gitHubClassIcon);

  //appendChildToElement(breadCrumbDiv, fileNameChangeIcon.toolTipElement, "?");

  // banner above commit message input
  var commitTitleText =
    "This is the title. Give a brief description of the change. Be short and objective. This is required.";
  
  let commitMessageIcon = new ToolTipIcon(
    "H4",
    "tooltip2",
    commitTitleText,
    "#commit-summary-input"
  );

  commitMessageIcon.createIcon();

  $(commitMessageIcon.toolTipElement).insertAfter("#commit-summary-input");

  var descriptionText =
    "Add a more detailed description if needed. Here you can" +
    " present your arguments and reasoning that lead to change.";
  
  let extendedDescIcon = new ToolTipIcon(
      "H4",
      "tooltip2",
      descriptionText,
      "#commit-description-textarea"
  );
  
  extendedDescIcon.createIcon();

  $(extendedDescIcon.toolTipElement).insertAfter(extendedDescIcon.gitHubClassIcon);
  
  // banner above Commit Changes / Cancel buttons
  var submitChangesText =
    "By clicking the Commit changes button you " +
    "will start the submission process. You " +
    "will have the chance to check your changes " +
    "before finalizing it.";
  
  let submitChangesIcon = new ToolTipIcon( 
    "H4", 
    "tooltip2",
    submitChangesText,
    "#submit-file"
  );

  submitChangesIcon.createIcon();

  $(submitChangesIcon.toolTipElement).insertAfter(submitChangesIcon.gitHubClassIcon);
}

/*
  Capture all user events that a user does, they should be able to save to their computer to send or save in a server for us to view
*/

/**
 * Function name: addProposeChangesToolTips
 * Adds tooltips to webpage when confirming a change to file
 * Second step in editing markdown files
 */
function addProposeChangesToolTips() {
  var branchContainerClass = "range-editor text-gray js-range-editor";

  var branchContainerText =
    "This represents the origin and destination of " +
    "your changes if you are not sure, leave it how it " +
    "is, this is common for small changes.";

  // ribbon above current current branch and new pull request branch
  let currentBranchRibbon = new toolTip(
    "H4",
    "alert alert-info text-center",
    branchContainerText,
    branchContainerClass
  );

  currentBranchRibbon.createElement();
  appendChildBeforeElement(
    currentBranchRibbon.gitHubClass,
    currentBranchRibbon.htmlElement,
    currentBranchRibbon.htmlElementText
  );

  addProgressBar(2, 3, "repository-content");

  var confirmPullRequestButton = "d-flex flex-justify-end m-2";

  var confirmPullRequestText =
    "By clicking here you will have a chance to change the " +
    "description of the change and continue with the submission " +
    "process.";

  // ribbon next to create pull request button
  let createPullRequest = new toolTip(
    "H4",
    "alert alert-warning text-center",
    confirmPullRequestText,
    confirmPullRequestButton
  );

  createPullRequest.createElement();

  appendChildBeforeElement(
    createPullRequest.gitHubClass,
    createPullRequest.htmlElement,
    createPullRequest.htmlElementText
  );

  var summaryText =
    "This shows the amount of commits in the pull request, " +
    "the amount of files you changed in the pull request, " +
    "how many comments were on the commits for the pull request" +
    " and the ammount of people who worked together on this " +
    "pull request.";

  var summaryClass = "overall-summary";

  // ribbon above summary of changes and commits
  let requestSummaryRibbon = new toolTip(
    "H4",
    "alert alert-warning text-center",
    summaryText,
    summaryClass
  );

  requestSummaryRibbon.createElement();

  appendChildBeforeElement(
    requestSummaryRibbon.gitHubClass,
    requestSummaryRibbon.htmlElement,
    requestSummaryRibbon.htmlElementText
  );

  var comparisonClass = "js-diff-progressive-container";

  var changesText =
    "This shows the changes between the orginal file and " +
    "your version. Green(+) represents lines added. " +
    "Red(-) represents removed lines";

  // ribbon above container for changes in current pull request
  let comparisonRibbon = new toolTip(
    "H4",
    "alert alert-warning text-center",
    changesText,
    comparisonClass
  );

  comparisonRibbon.createElement();

  appendChildBeforeElement(
    comparisonRibbon.gitHubClass,
    comparisonRibbon.htmlElement,
    comparisonRibbon.htmlElementText
  );
}

/**
 * Function name: addReviewPullRequestTips
 * Adds tooltips to webpage when reviewing pull requests
 * Third step in editing markdown files
 */
function addReviewPullRequestTips() {
  var branchContainerText =
    "This indicates that the pull request is open " +
    "meaning someone will get to it soon. ";

  var branchContainerClass = "TableObject-item TableObject-item--primary";

  // ribbon at top of page under pull request name
  let pullRequestStatusRibbon = new toolTip(
    "H4",
    "alert alert-info text-center",
    branchContainerText,
    branchContainerClass
  );

  pullRequestStatusRibbon.createElement();

  appendChildBeforeElement(
    pullRequestStatusRibbon.gitHubClass,
    pullRequestStatusRibbon.htmlElement,
    pullRequestStatusRibbon.htmlElementText
  );

  addProgressBar(3, 3, "gh-header-show");

  var requestButtonsText =
    "This will close the pull request meaning people " +
    "cannot view this! Do not click close unless the " +
    "request was solved. ";

  var requestButtonsClass = "d-flex flex-justify-end";

  let pullReuqestButtons = new toolTip(
    "H4",
    "alert alert-warning text-center",
    requestButtonsText,
    requestButtonsClass
  );

  pullReuqestButtons.createElement();

  appendChildBeforeElement(
    pullReuqestButtons.gitHubClass,
    pullReuqestButtons.htmlElement,
    pullReuqestButtons.htmlElementText
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
