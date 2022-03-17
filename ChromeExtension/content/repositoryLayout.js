function updateCodeTabId() {
  const codeNavLinkText = $(".UnderlineNav-body:eq(0) a:eq(0)").text().trim();

  if (codeNavLinkText === "Code") {
    $(".js-repo-nav a:eq(0)").prop("id", "codeLink");
  }

  createNavLinkClickListener("#codeLink", "code");
}

/**
 * Updates the main page of a repository to only dispay readme file
 */
async function createHomePage() {
  const currentPage = await getCurrentRepositoryPage();
  const canUpdateHomePage = isOnHomeOrCodePage();
  const hasForked = await getValueFromStorage("hasForked", false);
  const hasUploadedFile = await getValueFromStorage("hasUploadedNewFile", false);
  createHomePageLink();

  const filesContainer = $(".file-navigation");
  const totalIcons = $(".helpIcon").length;

  if (hasForked && !document.location.pathname.includes("upload") && filesContainer.length === 1) {
    createNewMessage("The repository was successfully forked");
  }
  if (hasUploadedFile && !document.location.pathname.includes("upload")) {
    createNewMessage("The files were successfully added");
  }

  if (currentPage === "home" && canUpdateHomePage) {
    hideFilesInRepository();

    $(".selected:eq(0)").removeClass("selected");
    $("#homePage").addClass("selected");

    if ($("#codeLink").attr("aria-current") === "page") {
      $("#codeLink").addClass("repoNavButton");
      $("#codeLink").attr("aria-current", "false");
    }

    $("#readme").removeClass("display-none");

    if (totalIcons < 1) {
      const readmeIconText =
        "To edit this file, go to the 'code' tab above, and select the file you want to edit.";
      createIconAfterElement(readmeIconText, ".Box-title");
    }
  } else if (currentPage === "code" && canUpdateHomePage) {
    $(".Box-header:eq(0)").removeClass("display-none");
    $(".selected:eq(0)").removeClass("selected");
    $("#codeLink").addClass("selected");
    $("#codeLink").attr("aria-current", "page");

    if (!document.location.pathname.includes("blob")) {
      $("#readme").addClass("display-none");
    }
  }

  if (!canUpdateHomePage && $(".selected:eq(0)").text().trim() === "Home") {
    $(".selected:eq(0)").removeClass("selected");
  }
}

const hideFilesInRepository = () => {
  $(".file-navigation").addClass("display-none");
  $(".Box-header:eq(0)").addClass("display-none");
  $(".Details-content--hidden-not-important:eq(1)").removeClass("d-md-block");
  $(".js-details-container:eq(1)").addClass("d-none");
};

/**
 * Creates green ribbon above files in repository after the repo has been forked
 */
function createNewMessage(newMessageContent) {
  const ribbonMessage = document.createTextNode(newMessageContent);
  const successRibbonContainer = document.createElement("div");

  successRibbonContainer.className = "successRibbon text-center";
  successRibbonContainer.appendChild(ribbonMessage);
  $(successRibbonContainer).insertBefore(".repository-content");

  if (newMessageContent.includes("file")) {
    chrome.storage.sync.set({ hasUploadedNewFile: false });
  } else {
    chrome.storage.sync.set({ hasForked: false });
  }
}

const createHomePageLink = () => {
  if (
    document.getElementById("homePage") === null &&
    document.getElementsByClassName("h-card").length === 0
  ) {
    const imageSource = chrome.runtime.getURL("images/house.png");
    const repoLink = $(".js-repo-nav a:eq(0)").attr("href");
    const newNavLink = document.createElement("li");
    const newNavLinkClass =
      "js-navigation-item UnderlineNav-item hx_underlinenav-item no-wrap js-responsive-underlinenav-item";

    newNavLink.className = "d-flex";
    newNavLink.innerHTML = `<a class="${newNavLinkClass}" id="homePage" data-tab-item="code-tab" href="${repoLink}" ">
                              <img src="${imageSource}" id="houseImage"/>
                              Home
                            </a>`;

    $(".UnderlineNav-body").prepend(newNavLink);
  }

  createNavLinkClickListener("#homePage", "home");
};

async function getCurrentRepositoryPage() {
  const currentPage = await getValueFromStorage("activePage", "home");

  return currentPage;
}

const isOnHomeOrCodePage = () => {
  const currentUrl = document.location.pathname;
  return currentUrl.split("/").length === 3;
};

const createNavLinkClickListener = (targetElement, targetPage) => {
  $(targetElement).on("click", (event) => {
    chrome.storage.sync.set({ activePage: targetPage });
  });
};

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "UPDATE_REPO_LAYOUT") {
    updateCodeTabId();
    createHomePage();
  }
});
