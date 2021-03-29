/**
 * Function name: updateLink
 * Updates id of code link in nav bar
 */
function updateCodeLink() {
  const codeNavLinkText = $('.UnderlineNav-body:eq(0) a:eq(0)').text().trim();

  if (codeNavLinkText === 'Code') {
    $('.js-repo-nav a:eq(0)').prop('id', 'codeLink');
  }

  $('#codeLink').on('click', (event) => {
    const $currentLinkText = $('.selected:eq(0)').text().trim();

    if ($currentLinkText === 'Home' || $currentLinkText === 'Code') {
      event.preventDefault();
    }

    chrome.storage.sync.set({ activePage: 'code' });

    createHomePage();
  });
}

/**
 * Function name: createHomePage
 * Updates the main page of a repository to only dispay readme file
 */
async function createHomePage() {
  createHomePageLink();
  const currentPage = await getCurrentRepositoryPage();
  const canUpdateHomePage = isOnHomeOrCodePage();

  const hasForked = await checkForkStatus();
  const hasUploadedFile = await checkIfUploadedNewFile();

  const forkedMessage = 'The repository was successfully forked';
  const filesMessage = 'The files were successfully added';
  const filesContainer = $('.Box:contains("commits")');
  const totalIcons = $('.helpIcon').length;

  let pencilIconClass = '.octicon-pencil';

  if (
    hasForked &&
    !document.location.pathname.includes('upload') &&
    filesContainer.length === 1
  ) {
    createNewMessage(forkedMessage);
  }
  if (hasUploadedFile && !document.location.pathname.includes('upload')) {
    createNewMessage(filesMessage);
  }

  if (currentPage === 'home' && canUpdateHomePage) {
    // toggle display for files in repo
    filesContainer.addClass('hiddenDisplay');
    $('.file-navigation:eq(0)').addClass('hiddenDisplay');

    $('.Details-content--hidden-not-important:eq(1)').removeClass('d-md-block');
    $('.file-navigation:eq(0)').removeClass('d-flex');

    $('.selected:eq(0)').removeClass('selected');

    $('#homePage').addClass('selected');

    if ($('#codeLink').attr('aria-current') === 'page') {
      $('#codeLink').addClass('repoNavButton');
      $('#codeLink').attr('aria-current', 'false');
    }

    $('#readme').removeClass('hiddenDisplay');

    if (totalIcons < 1) {
      const readmeIcon = new ToolTip(
        'H4',
        'helpIcon',
        'To edit this file, go to the "code" tab above, and select the file you want to edit.',
        pencilIconClass
      );

      readmeIcon.createIcon();

      $(readmeIcon.toolTipElement).insertAfter(readmeIcon.gitHubElement);

      $(readmeIcon.toolTipElement).on('click', (event) => {
        event.preventDefault();
      });
    }
  } else if (currentPage === 'code' && canUpdateHomePage) {
    $('.selected:eq(0)').removeClass('selected');
    $('#codeLink').addClass('selected');
    $('#codeLink').attr('aria-current', 'page');

    createAccordionLayout();
  }

  try {
    if (
      document.getElementsByClassName('octicon-pencil').length === 0 &&
      $('.selected:eq(0)').text() !== 'Code'
    ) {
      pencilIconClass = '.Box-title';
    }
  } catch (error) {
    // do nothing
  }
}

/**
 * Function name: createForkedMessage
 * Creates green ribbon above files in repository after the repo has been forked
 */
function createNewMessage(newMessageContent) {
  const successRibbonContainer = document.createElement('div');
  successRibbonContainer.className = 'successRibbon text-center';

  const ribbonMessage = document.createTextNode(newMessageContent);

  successRibbonContainer.appendChild(ribbonMessage);

  $(successRibbonContainer).insertBefore('.Box:contains("commits"):eq(0)');

  if (newMessageContent.includes('file')) {
    chrome.storage.sync.set({ hasUploadedNewFile: false });
  } else {
    chrome.storage.sync.set({ hasForked: false });
  }
}

/**
 * Function name: createAccordionLayout
 * Display files in repository inside an dropdown menu
 */
function createAccordionLayout() {
  const canUpdateFiles = isOnHomeOrCodePage();

  try {
    if (canUpdateFiles) {
      // find the row with commit history information and update the css class to be an accordion
      $('.Box:contains("commits") > .Box-header--blue').addClass('accordion');
      $('.js-details-container:eq(2)').addClass('panel');

      const filesContainer = $('.Box:contains("commits")');
      filesContainer.removeClass('hiddenDisplay');

      $('.file-navigation:eq(0)').removeClass('hiddenDisplay');

      $('.Details-content--hidden-not-important:eq(1)').addClass('d-md-block');
      $('.file-navigation:eq(0)').addClass('d-flex');

      $('.selected:eq(0)').removeClass('selected');

      $('#codeLink').addClass('selected');

      if (!document.location.pathname.includes('blob')) {
        $('#readme').addClass('hiddenDisplay');
      }
    }
  } catch (error) {
    // do nothing
  }
}

/**
 * Function name: checkForkStatus
 * Retrieves stored value to check if current repository was just forked
 */
async function checkForkStatus() {
  const hasForked = new Promise((resolve) => {
    chrome.storage.sync.get('hasForked', (result) => {
      resolve(result.hasForked);
    });
  });

  return hasForked;
}

/**
 * Function name: checkIfUploadedNewFile
 * Retrieves stored value to check if current repository was just forked
 */
async function checkIfUploadedNewFile() {
  const hasUploadedFile = new Promise((resolve) => {
    chrome.storage.sync.get('hasUploadedNewFile', (result) => {
      resolve(result.hasUploadedNewFile);
    });
  });

  return hasUploadedFile;
}

/**
 * Function name: toggleAccordion
 * Updates files to collapse and expand
 */
function toggleAccordion() {
  $('.accordion').toggleClass('active');

  const panel = document.getElementsByClassName('panel')[0];

  panel.style.maxHeight
    ? (panel.style.maxHeight = null)
    : (panel.style.maxHeight = panel.scrollHeight + 'px');

  // update title of each file within the github repository
  $('.js-details-container:eq(2) .Link--primary').each((index, element) => {
    $(element).attr('title', 'To view this file, click here');
  });
}

/**
 * Function name: createHomePageLink
 * Appends new link to top nav bar in repository
 */
function createHomePageLink() {
  if (
    document.getElementById('homePage') === null &&
    document.getElementsByClassName('h-card').length === 0
  ) {
    const imageSource = chrome.runtime.getURL('images/house.png');

    const repoLink = $('a[data-pjax="#js-repo-pjax-container"]').attr('href');

    const newNavLink = document.createElement('li');
    newNavLink.className = 'd-flex';

    newNavLink.innerHTML = `<a class="js-navigation-item UnderlineNav-item hx_underlinenav-item no-wrap js-responsive-underlinenav-item" id="homePage" data-tab-item="code-tab" href="${repoLink}" ">
                              <img src="${imageSource}" id="houseImage"/>
                              Home
                            </a>`;

    $('.UnderlineNav-body').prepend(newNavLink);
  }

  $('#homePage').on('click', (event) => {
    const currentLinkText = $('.selected:eq(0)').text().trim();

    if (currentLinkText === 'Home' || currentLinkText === 'Code') {
      event.preventDefault();
    }

    chrome.storage.sync.set({ activePage: 'home' });

    createHomePage();
  });
}

/**
 * Function name: getCurrentRepositoryPage
 * Returns page the user clicked on within repository
 */
async function getCurrentRepositoryPage() {
  const storedPage = new Promise((resolve) => {
    chrome.storage.sync.get('activePage', (result) => {
      if (result.activePage === undefined) {
        resolve('home');
      } else {
        resolve(result.activePage);
      }
    });
  });

  const currentPage = await storedPage;

  return currentPage;
}

/**
 * Function name: updatePencilIcon
 * Adds icon next to pencil icon to edit files
 */
function updatePencilIcon() {
  const fileIcon = new ToolTip(
    'H4',
    'helpIcon',
    'Click the pencil to edit the file and start a pull request',
    '.js-update-url-with-hash:eq(1)'
  );

  fileIcon.createIcon();
  $(fileIcon.toolTipElement).insertAfter(fileIcon.gitHubElement);
}

/**
 * Function name: isOnHomeOrCodePage
 * Returns if the user is currently on the home or code page of a repository
 */
function isOnHomeOrCodePage() {
  const invalidUrls = [
    '/blob/',
    'pull',
    '/issues',
    '/settings',
    '/actions',
    '/projects',
    '/wiki',
    'pulse',
    'tree',
    'commits',
  ];

  let isCurrentlyOnHomeorCodePage = true;

  invalidUrls.forEach((invalidUrl) => {
    if (document.location.pathname.includes(invalidUrl)) {
      isCurrentlyOnHomeorCodePage = false;
    }
  });

  return isCurrentlyOnHomeorCodePage;
}

/**
 * Listen to page changes from the background
 */
chrome.runtime.onMessage.addListener((msg) => {
  const currentUrlPath = document.location.pathname;

  if (msg.type === 'UPDATE_REPO_LAYOUT') {
    if (currentUrlPath.includes('/blob/') && $('.helpIconCircle').length === 1) {
      updatePencilIcon();
    }
    $(() => {
      {
        $('.Box:contains("commits") > .Box-header--blue').on('click', () => {
          toggleAccordion();
        });
      }
    });
    try {
      updateCodeLink();
      createHomePage();
    } catch (error) {
      window.location.assign(document.location.pathname);
    }
  }
});
