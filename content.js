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
// check the current url and call functions accordingly
checkURL();

function checkURL() {
  // if the user is editing a markdown file
  if (
    window.location.href.indexOf(".md") != NOT_FOUND &&
    window.location.href.indexOf("edit" != NOT_FOUND)
  ) {
    addReadMeToolTips();
    // if the user is reviewing a pull request
  } else if (
    window.location.href.indexOf("pull") != NOT_FOUND &&
    window.location.href.indexOf("quick_pull") == NOT_FOUND
  ) {
    addReviewPullRequestTips();
    // if the user is opening a pull request
  } else if (window.location.href.indexOf("compare") != NOT_FOUND) {
    addProposeChangesToolTips();
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

  className.appendChild(node);
}

/**
 * Function name: addReadMeToolTips
 * Adds tooltips to webpage when editing markdown files
 */
function addReadMeToolTips() {
  // ribbon above the editor
  let topRibbon = new toolTip(
    "H4",
    "alert alert-info text-center",
    "This is the editor where you can make changes to your files.",
    "js-blob-form"
  );
  topRibbon.createElement();
  appendChildBeforeElement(
    topRibbon.gitHubClass,
    topRibbon.htmlElement,
    topRibbon.htmlElementText
  );

  // banner to left of file name input
  var fileNameChangeText =
    "This is the file name, changing it will create " +
    " a new file with the new name";

  var breadCrumbDiv =
    "breadcrumb d-flex flex-shrink-0 flex-items-center px-3 px-sm-6 px-lg-3";

  let fileNameChange = new toolTip(
    "H4",
    "alert alert-warning",
    fileNameChangeText,
    breadCrumbDiv
  );
  fileNameChange.createElement();
  fileNameChange.htmlElement.style.marginRight = "20px";

  appendChildBeforeElement(
    fileNameChange.gitHubClass,
    fileNameChange.htmlElement,
    fileNameChange.htmlElementText
  );

  // banner above commit message input
  var commitTitleText =
    "This is the title. Give a brief description of the change. Be short and objective.";
  var commitMessageClass =
    "commit-form position-relative mb-2 p-3 " +
    " border-0 border-lg-top border-lg-right " +
    " border-lg-left border-lg-bottom rounded-1";

  // select the H3 tag wihtin the commit changes box
  var commitMessageHeader = document
    .getElementsByClassName(commitMessageClass)[0]
    .getElementsByTagName("H3")[0];

  let commitMessageTitle = new toolTip(
    "H4",
    "alert alert-warning text-center",
    commitTitleText,
    commitMessageHeader
  );
  commitMessageTitle.createElement();

  appendChildToElement(
    commitMessageTitle.gitHubClass,
    commitMessageTitle.htmlElement,
    commitMessageTitle.htmlElementText
  );

  var descriptionText =
    "Add a more detailed description if needed. Here you can" +
    " present your arguments and reasoning that lead to change.";
  let commitExtendedDesc = new toolTip(
    "H4",
    "alert alert-warning text-center",
    descriptionText,
    "commit-description-textarea"
  );

  commitExtendedDesc.createElement();

  commitExtendedDesc.htmlElement.innerHTML = commitExtendedDesc.htmlElementText;

  // get the parent container of the input fields and append the
  // commitDescriptionContainer before the commitSummaryInput
  var parentDiv = document.getElementById(commitExtendedDesc.gitHubClass)
    .parentNode;
  var gitHubSummaryInput = document.getElementById(
    "commit-description-textarea"
  );
  parentDiv.insertBefore(commitExtendedDesc.htmlElement, gitHubSummaryInput);

  // banner above Commit Changes / Cancel buttons
  var submitChangesText =
    "By clicking the Commit changes button you " +
    "will start the submission process. You " +
    "will have the chance to check your changes " +
    "before finalizing it.";

  var formRootClass =
    "d-flex flex-column d-md-block col-lg-11 offset-lg-1 " +
    " pr-lg-3 js-file-commit-form";

  let submitChangesButton = new toolTip(
    "H4",
    "alert alert-warning text-center",
    submitChangesText,
    formRootClass
  );

  submitChangesButton.createElement();
  submitChangesButton.htmlElement.innerHTML =
    submitChangesButton.htmlElementText;

  var commitButton = document.getElementById("submit-file");

  // Get the root div of the form and append the new H4 before the commit button
  var formRootDiv = document.getElementsByClassName(
    submitChangesButton.gitHubClass
  )[0];
  formRootDiv.insertBefore(submitChangesButton.htmlElement, commitButton);
}

/**
 * Function name: addReviewPullRequestTips
 * Adds tooltips to webpage when editing markdown files
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
 * Function name: addProposeChangesToolTips
 * Adds tooltips to webpage when confirming a pull request
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
