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
    document.getElementsByClassName("flash")[0].innerText = getString("NOW_EDITING_FILE_MESSAGE");
  }

  const fileNameChangeIconText = getString("FILENAME_TOOLTIP");
  const branchNameLink = ".branch-name:eq(0)";
  createIconAfterElement(fileNameChangeIconText, branchNameLink);

  updatePullRequestTitleInput();
  updatePullRequestDescriptionInput();

  const createPullRequestIconText = getString("PROPOSE_CHANGES_TOOLTIP");
  const directlyCommitIconText = getString("DIRECTLY_COMMIT_CHANGES_TOOLTIP");
  const submitButtonText = document.getElementsByClassName("btn-primary")[1].innerText;
  const submitChangesIconText =
    submitButtonText === "Propose changes" ? createPullRequestIconText : directlyCommitIconText;
  createIconBeforeElement(submitChangesIconText, "#submit-file");

  $('input[name="commit-choice"]').on("click", () => {
    $(".helpIconText:eq(3)").toggleText(createPullRequestIconText, directlyCommitIconText);
  });
}

const updatePullRequestTitleInput = () => {
  const inputTitleLabel = document.createElement("h3");
  inputTitleLabel.innerHTML = "Insert a title here";
  inputTitleLabel.className = "label-margin-right";
  $(inputTitleLabel).insertBefore("#commit-summary-input");

  const commitTitleIconText = getString("PULL_REQUEST_TITLE_TOOLTIP");
  createIconAfterElement(commitTitleIconText, "#commit-summary-input");
};

const updatePullRequestDescriptionInput = () => {
  const inputDescriptionLabel = document.createElement("h3");
  inputDescriptionLabel.innerHTML = "Insert a <br> description here";
  inputDescriptionLabel.className = "label-margin-right";
  $(inputDescriptionLabel).insertBefore("#commit-description-textarea");

  const descriptionIconText = getString("PULL_REQUEST_DESCRIPTION_TOOLTIP");
  createIconAfterElement(descriptionIconText, "#commit-description-textarea");
};

/**
 * Creates tooltips when confirming a change to file (Second step)
 */
function createConfirmPullRequestToolTips() {
  pullRequestProcess.createProgressBar(2, ".repository-content");

  const pullRequestDescription = getString("PULL_REQUEST_DETAILED_DESCRIPTION_TOOLTIP");
  $("#pull_request_body").attr("placeholder", pullRequestDescription);

  let isComparingBranch = false;

  if (document.getElementsByClassName("branch-name").length > 0) {
    isComparingBranch = true;
  }

  if (isComparingBranch) {
    $(".Subhead-heading").text("Create Pull Request");
  }

  const pullRequestTitle = document.getElementsByClassName("Subhead-heading")[1];
  pullRequestTitle.innerHTML = "Create pull request";

  const topRibbon = document.getElementsByClassName("js-range-editor")[0];
  topRibbon.style.width = "93%";
  topRibbon.style.display = "inline-block";

  const destinationIconText = getString("PULL_REQUEST_ORIGIN_AND_DESTINATION_TOOLTIP");
  createIconAfterElement(destinationIconText, ".js-range-editor:eq(0)");

  if (!isComparingBranch) {
    const buttonRow = document.getElementsByClassName("d-flex flex-justify-end m-2")[0];
    buttonRow.classList.remove("flex-justify-end");
    buttonRow.classList.add("flex-justify-start");
  }

  const createPullRequestButtonIconText = getString("CREATE_PULL_REQUEST_TOOLTIP");
  const submitButtonClass = ".js-pull-request-button";

  createIconAfterElement(createPullRequestButtonIconText, submitButtonClass);

  const requestSummaryIconText = getString("PULL_REQUEST_SUMMARY_TOOLTIP");

  const summaryClass = ".overall-summary";
  createIconAfterElement(requestSummaryIconText, summaryClass);

  createPullRequestComparisonIcon();
}

const createPullRequestComparisonIcon = () => {
  const comparisonIconText = getString("PULL_REQUEST_FILE_COMPARISON_TOOLTIP");

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

  const pullRequestStatusIconText = getString("PULL_REQUEST_STATUS_TOOLTIP");
  const pullRequestState = $(".State:eq(0)").text().trim();

  if (pullRequestState !== "Closed") {
    const pullRequestStatusIcon = createIconAfterElement(pullRequestStatusIconText, ".State:eq(0)");

    pullRequestStatusIcon.style.marginLeft = "10px";
    pullRequestStatusIcon.style.marginRight = "10px";
  }

  $(".tabnav-tabs:eq(0)").addClass("overflow-visible");
  $(".tabnav-tabs:eq(0)").removeClass("overflow-auto");

  const pullRequestNavIconText = getString("PULL_REQUEST_MENU_TOOLTIP");

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
  $(".d-flex.flex-justify-end").removeClass("flex-justify-end");
};

const updateClosePullRequestButton = () => {
  const pullRequestName = document.getElementsByClassName("js-issue-title")[0].innerText;
  const closePullRequestButtonClass = 'button[name="comment_and_close"]';
  const closePullRequestButton = $(closePullRequestButtonClass);
  const closePullRequestIconText = getString("CLOSE_PULL_REQUEST_TOOLTIP");

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
    const ribbonMessage = getString("PULL_REQUEST_CREATED_MESSAGE");
    const ribbonTextNode = document.createTextNode(ribbonMessage);

    successRibbonContainer.className = "successRibbon text-center";
    successRibbonContainer.appendChild(ribbonTextNode);
    $(successRibbonContainer).insertBefore(".container");
  }
}

const createMessageSubmittedRibbon = async () => {
  const hasSubmittedMessage = await getValueFromStorage("hasSubmittedMessage", false);
  if (hasSubmittedMessage && $(".successRibbon").length === 1) {
    const ribbonMessage = getString("COMMENT_ADDED_MESSAGE");
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

  const commitIconText = getString("COMMIT_TITLE_TOOLTIP");
  createIconAfterElement(commitIconText, "#commit-summary-input");

  const commitDescriptionText = getString("COMMIT_FILES_DESCRIPTION_TOOLTIP");
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

const updateViewFilePage = () => {
  const historyLinkText = getString("HISTORY_LINK_TOOLTIP");
  const fileIconText = getString("PENCIL_ICON_TOOLTIP");
  const fileIconClassname = ".js-update-url-with-hash:eq(1)";

  if ($(".helpIcon").length === 0) {
    createIconAfterElement(historyLinkText, ".ml-3:eq(1)");
    createIconAfterElement(fileIconText, fileIconClassname);
  }
};

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
$(".btn-with-count button:eq(0)").on("click", () => {
  chrome.storage.sync.set({ hasForked: true });
});
