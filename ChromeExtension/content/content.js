const plugin = {
  currentPageUrl: document.location.pathname,
  hasInjectedContent: false,

  checkUrl: () => {
    const urlArray = [
      {
        name: "/edit/",
        runFunction: createFileEditorToolTips,
      },
      {
        name: "/compare/",
        runFunction: createConfirmPullRequestToolTips,
      },
      {
        name: "/pull/",
        runFunction: createReviewPullRequestToolTips,
      },
      {
        name: "/upload/",
        runFunction: updateUploadFilesPage,
      },
      {
        name: "/blob/",
        runFunction: updateViewFilePage,
      },
    ];
    const foundUrl = urlArray.find((object) => plugin.currentPageUrl.includes(object.name));
    foundUrl?.runFunction() ?? console.log("URL was not found.");
  },
};

window.onload = () => {
  if (!plugin.hasInjectedContent) {
    plugin.hasInjectedContent = true;
    plugin.currentPageUrl = document.location.pathname;
    plugin.checkUrl();
  }
};

/**
 * Object for monitoring progress of the pull request process
 */
const pullRequestProcess = {
  steps: ["Edit File", "Confirm Pull Request", "Pull Request Opened"],
  currentStep: 2,
  totalSteps: 3,

  setCurrentStep: (newStep) => {
    pullRequestProcess.currentStep = newStep;
  },

  getCurrentStep: () => {
    return pullRequestProcess.currentStep;
  },

  createProgressBar: (updatedStep, rootElement) => {
    pullRequestProcess.currentStep = updatedStep;
    const { totalSteps, steps } = pullRequestProcess;
    addProgressBar(updatedStep, totalSteps, rootElement, steps);
  },
};

/**
 * Adds tooltips when editing files (First step)
 */
function createFileEditorToolTips() {
  pullRequestProcess.createProgressBar(1, ".js-blob-form");

  if (document.getElementsByClassName("flash-messages ")[0] !== null) {
    $(".flash-messages").addClass("text-center");
    document.getElementsByClassName("flash")[0].innerText =
      "You are now editing the file, make your changes below and press the green button to continue";
  }

  const fileNameChangeIconText =
    "This is the file name, changing it will create a new file with the new name.";

  const breadCrumbDiv = ".d-md-inline-block";
  createIconAfterElement(fileNameChangeIconText, breadCrumbDiv);

  updatePullRequestTitleInput();
  updatePullRequestDescriptionInput();

  const createPullRequestIconText =
    "By clicking the Propose changes button you will start the pull request submission process. You will have the chance to check your changes before finalizing it.";
  const directlyCommitIconText =
    "By clicking the Commit Changes button the changes will automatically be pushed to the repo";

  const submitButtonText = document.getElementsByClassName("btn-primary")[1].innerText;
  const submitChangesIconText =
    submitButtonText === "Propose changes" ? createPullRequestIconText : directlyCommitIconText;
  createIconBeforeElement(submitChangesIconText, "#submit-file");

  $('input[name="commit-choice"]').on("click", () => {
    $(".helpIconText:eq(4)").toggleText(createPullRequestIconText, directlyCommitIconText);
  });
}

const updatePullRequestTitleInput = () => {
  const inputTitleLabel = document.createElement("h3");
  inputTitleLabel.innerHTML = "Insert a title here";
  inputTitleLabel.className = "label-margin-right";
  $(inputTitleLabel).insertBefore("#commit-summary-input");

  const commitMessageIconText =
    "This is the title of the pull request. Give a brief description of the change. Be short and objective.";

  createIconAfterElement(commitMessageIconText, "#commit-summary-input");
};

const updatePullRequestDescriptionInput = () => {
  const inputDescriptionLabel = document.createElement("h3");
  inputDescriptionLabel.innerHTML = "Insert a <br> description here";
  inputDescriptionLabel.className = "label-margin-right";
  $(inputDescriptionLabel).insertBefore("#commit-description-textarea");

  const extendedDescIconText =
    "Add a more detailed description of the pull request if needed. Here you can present your arguments and reasoning that lead to change.";

  createIconAfterElement(extendedDescIconText, "#commit-description-textarea");
};

/**
 * Creates tooltips when confirming a change to file (Second step)
 */
function createConfirmPullRequestToolTips() {
  pullRequestProcess.createProgressBar(2, ".repository-content");

  // change placeholder of pull request comment input
  const newPullRequestPlaceHolderText =
    "You can add a more detailed description of the pull request here if needed.";

  $("#pull_request_body").attr("placeholder", newPullRequestPlaceHolderText);

  let isComparingBranch = false;

  if (document.getElementsByClassName("branch-name").length > 0) {
    isComparingBranch = true;
  }

  // change header of different element when comparing a branch pull request
  if (isComparingBranch) {
    $(".Subhead-heading").text("Create Pull Request");
  }

  // change header in top of editor
  const pullRequestTitle = document.getElementsByClassName("Subhead-heading")[1];
  pullRequestTitle.innerHTML = "Create pull request";

  // adjust width of navbar for new icon element
  const topRibbon = document.getElementsByClassName("js-range-editor")[0];
  topRibbon.style.width = "93%";
  topRibbon.style.display = "inline-block";

  // icon next to current branch and new pull request branch name
  const currentBranchIconIconText =
    "This represents the origin and destination of your pull request.";
  createIconAfterElement(currentBranchIconIconText, ".js-range-editor:eq(0)");

  // move button row to left side of editor
  if (!isComparingBranch) {
    const buttonRow = document.getElementsByClassName("d-flex flex-justify-end m-2")[0];
    buttonRow.classList.remove("flex-justify-end");
    buttonRow.classList.add("flex-justify-start");
  }

  // icon next to create pull request button
  const createPullRequestButtonIconText =
    "By clicking this button you will create the pull request to allow others to view your changes and accept them into the repository.";
  const submitButtonClass = ".js-pull-request-button";

  createIconAfterElement(createPullRequestButtonIconText, submitButtonClass);

  // icon above summary of changes and commits
  const requestSummaryIconText =
    "This shows the amount of commits in the pull request, the amount of files you changed in the pull request, how many comments were on the commits for the pull request and the ammount of people who worked together on this pull request.";
  const summaryClass = ".overall-summary";
  createIconAfterElement(requestSummaryIconText, summaryClass);

  createPullRequestComparisonIcon();
}

const createPullRequestComparisonIcon = () => {
  const comparisonIconText =
    "This shows the changes between the orginal file and your version. Green(+) represents lines added. Red(-) represents removed lines";

  const comparisonClass = "#commits_bucket";
  const comparisonIcon = createIconAfterElement(comparisonIconText, comparisonClass);
  comparisonIcon.style.float = "right";
  comparisonIcon.style.marginTop = "20px";
  comparisonIcon.style.marginRight = "-10px";
};

/**
 * Adds tooltips when reviewing a pull request (Final step)
 */
function createReviewPullRequestToolTips() {
  pullRequestProcess.createProgressBar(3, ".gh-header");

  const pullRequestStatusIconText =
    "This indicates that the pull request is open meaning someone will get to it soon.";

  const pullRequestState = $(".State:eq(0)").text().trim();

  if (pullRequestState !== "Closed") {
    const pullRequestStatusIcon = createIconAfterElement(pullRequestStatusIconText, ".State:eq(0)");

    pullRequestStatusIcon.style.marginLeft = "10px";
    pullRequestStatusIcon.style.marginRight = "10px";
  }

  $(".tabnav-tabs:eq(0)").addClass("overflow-visible");
  $(".tabnav-tabs:eq(0)").removeClass("overflow-auto");

  const pullRequestNavIconText =
    "Feel free to explore this menu, you can discuss with project contributors, see the commits made, check the review status and see the files changed.";

  const totalTabs = $(".tabnav-tabs:eq(0) .tabnav-tab").length;
  createIconAfterElement(pullRequestNavIconText, `.tabnav-tab:eq(${totalTabs - 1})`);

  $(".helpIconText:eq(1)").width(250);

  $("primer-tooltip[for='md-mention-new_comment_field']").html(
    'Use "@" to mention a project contributor.'
  );

  updatePullRequestButtonRow();
  updateClosePullRequestButton();
  $(document).on("submit", ".js-new-comment-form", () => {
    chrome.storage.sync.set({ hasSubmittedMessage: true });
    createMessageSubmittedRibbon();
  });
}

const updatePullRequestButtonRow = () => {
  const buttonRow = document.getElementsByClassName("d-flex flex-justify-end")[0];
  buttonRow.classList.remove("flex-justify-end");
  buttonRow.classList.add("flex-justify-start");
};

const updateClosePullRequestButton = () => {
  const pullRequestName = document.getElementsByClassName("js-issue-title")[0].innerText;
  const closePullRequestButtonClass = 'button[name="comment_and_close"]';
  const closePullRequestButton = $(closePullRequestButtonClass);
  const closePullRequestIconText =
    "This will close the pull request meaning people cannot view this! Do not click close unless the request was solved.";

  const closePullRequestIcon = createIconBeforeElement(
    closePullRequestIconText,
    closePullRequestButtonClass
  );
  closePullRequestIcon.style.marginRight = "20px";

  closePullRequestButton.on("click", (event) => {
    if (!confirm(`Are you sure that you want to close the pull request: ${pullRequestName}?`)) {
      event.preventDefault();
    }
  });
};

/**
 * Function name: checkIsEditingForkedFile
 * Checks if the user is viewing a file that they do not own
 */
function isEditingForkedFile() {
  const pencilIconLabelsList = [
    "Edit the file in your fork of this project",
    "Fork this project and edit the file",
  ];

  try {
    const pencilIconLabel = document
      .getElementsByClassName("tooltipped")[2]
      .getAttribute("aria-label");
    // check if there is a pencil icon with this aria label
    return pencilIconLabelsList.includes(pencilIconLabel);
  } catch (error) {
    return false;
  }
}

/**
 * @returns If user is currently viewing a file within a project
 */
function isCurrentlyViewingFile() {
  return document.location.pathname.includes("blob") && $(".js-file-line-container").length > 0;
}

/**
 * Edits pencil label when viewing a file in a repository that you are not a contributor of
 */
function createForkedFileToolTips() {
  $(".tooltipped-nw:nth-child(2)").attr("aria-label", "Edit File");
}

const isPullRequestOpen = () => {
  const gitHubStateElements = document.getElementsByClassName("State");
  return gitHubStateElements[0]?.getAttribute("title") === "Status: Open" ?? false;
};

function createSuccessRibbon() {
  if (document.location.pathname.includes("/pull")) {
    const successRibbonContainer = document.createElement("div");
    successRibbonContainer.className = "successRibbon text-center";
    const ribbonMessage = "The pull request was created successfully and will be reviewed shortly";

    const ribbonTextNode = document.createTextNode(ribbonMessage);
    successRibbonContainer.appendChild(ribbonTextNode);
    $(successRibbonContainer).insertBefore(".container");
  }
}

const createMessageSubmittedRibbon = async () => {
  const hasSubmittedMessage = await getValueFromStorage("hasSubmittedMessage", false);
  if (hasSubmittedMessage && $(".successRibbon").length === 1) {
    const ribbonMessage = `The mentioned user will receive a notification and may help you work on the pull request.`;
    $(".successRibbon").html(ribbonMessage);
  }

  if (hasSubmittedMessage && $(".container").length === 1) {
    chrome.storage.sync.set({ hasSubmittedMessage: false });
  }
};

const updateUploadFilesPage = () => {
  const forkButton = ".btn-with-count button:eq(0)";

  if (cannotForkRepository()) {
    $(".blankslate p:first").text(
      "In order to upload files, click the fork button on the upper right"
    );

    $(forkButton).addClass("btn-primary");
  }

  const commitIconText =
    "This is the title of the commit. Give a brief description of the change. Be short and objective.";
  createIconAfterElement(commitIconText, "#commit-summary-input");

  const commitDescriptionText =
    "Add a more detailed description of the commit if needed. Here you can describe the files uploaded.";
  createIconAfterElement(commitDescriptionText, "#commit-description-textarea");

  $('button[data-edit-text="Commit changes"]').on("click", () => {
    chrome.storage.sync.set({ hasUploadedNewFile: true, activePage: "home" });
  });
};

const cannotForkRepository = () => {
  return (
    $(".blankslate p:first").text().trim() ===
    "File uploads require push access to this repository."
  );
};

/**
 * Adds tooltip when viewing a file in a repository
 */
function updateViewFilePage() {
  const historyLinkText =
    'Use the "History" link <br> to view changes to this <br> file by other contributors.';
  createIconAfterElement(historyLinkText, ".ml-3:eq(1)");
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "CHECK_URL") {
    if (!plugin.hasInjectedContent || $(".helpIcon").length === 0) {
      plugin.hasInjectedContent = true;
      plugin.currentPageUrl = document.location.pathname;

      plugin.checkUrl();
    }
    if (isEditingForkedFile()) {
      createForkedFileToolTips();
    }
    if (isCurrentlyViewingFile()) {
      plugin.currentPageUrl = document.location.pathname;
      plugin.checkUrl();
    }
  } else if (msg.type === "TOGGLE_EXTENSION") {
    toggleExtension();
  }
});

function toggleExtension() {
  $(".helpIcon").toggleClass("display-none");
  $(".successRibbon").toggleClass("display-none");
  $(".container").toggleClass("display-none");
}

// listen globaly for fork button to be clicked
$(".btn-with-count button:eq(0)").on("click", (event) => {
  chrome.storage.sync.set({ hasForked: true });
});
