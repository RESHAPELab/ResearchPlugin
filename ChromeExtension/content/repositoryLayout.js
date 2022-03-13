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

    createAccordionLayout();
  }

  if (!canUpdateHomePage && $(".selected:eq(0)").text().trim() === "Home") {
    $(".selected:eq(0)").removeClass("selected");
  }
}

const hideFilesInRepository = () => {
  $(".file-navigation").addClass("display-none");
  $(".Box-header:eq(0)").addClass("display-none");
  $(".Details-content--hidden-not-important:eq(1)").removeClass("d-md-block");
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

function createAccordionLayout() {
  const canUpdateFiles = isOnHomeOrCodePage();

  if (canUpdateFiles) {
    $(".Box-header:eq(0)").addClass("accordion");
    $(".js-details-container:eq(2)").addClass("panel");

    const filesContainer = $('.Box:contains("commits")');
    filesContainer.removeClass("display-none");

    $(".file-navigation:eq(0)").removeClass("display-none");
    $(".file-navigation:eq(0)").addClass("d-flex");

    $(".Details-content--hidden-not-important:eq(1)").addClass("d-md-block");

    $(".selected:eq(0)").removeClass("selected");
    $("#codeLink").addClass("selected");

    if (!document.location.pathname.includes("blob")) {
      $("#readme").addClass("display-none");
    }
  }
}

const toggleFileAccordion = () => {
  const filenameClass = ".js-details-container:eq(2) .Link--primary";
  $(".Box-header:eq(0)").toggleClass("active");
  const panel = document.getElementsByClassName("panel")[0];

  panel.style.maxHeight
    ? (panel.style.maxHeight = null)
    : (panel.style.maxHeight = panel.scrollHeight + "px");

  $(filenameClass).each((index, element) => {
    $(element).attr("title", "To view this file, click here");
  });
};

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

/**
 * Returns page the user clicked on within repository
 */
async function getCurrentRepositoryPage() {
  const storedPage = new Promise((resolve) => {
    chrome.storage.sync.get("activePage", (result) => {
      if (result.activePage === undefined) {
        resolve("home");
      } else {
        resolve(result.activePage);
      }
    });
  });

  const currentPage = await storedPage;

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

$(document).on("click", ".Box-header:eq(0)", () => {
  toggleFileAccordion();
});
