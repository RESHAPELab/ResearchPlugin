try {
  updateLink();

  createHomePage();
} catch (error) {
  // do nothing
}

/**
 * Function name: updateLink
 * Updates id of code link in nav bar
 */
function updateLink() {
  const codeNavLinkText = $('.js-selected-navigation-item:eq(4)').text().trim();

  if (codeNavLinkText === 'Code') {
    $('.js-selected-navigation-item:eq(4)').attr('id', 'codeLink');
  }
}

/**
 * Function name: createHomePage
 * Updates the main page of a repository to only dispay readme file
 */
async function createHomePage() {
  createHomePageLink();

  const hasForked = await checkForkStatus();

  if (hasForked) {
    createForkedMessage();
  }

  const currentPage = await getCurrentRepositoryPage();

  if (currentPage === 'home') {
    // toggle display for files in repo
    const $filesContainer = $('.Box:eq(3)');
    $filesContainer.addClass('hiddenDisplay');
    $('.file-navigation:eq(0)').addClass('hiddenDisplay');

    $('.Details-content--hidden-not-important:eq(1)').removeClass('d-md-block');
    $('.file-navigation:eq(0)').removeClass('d-flex');

    const codeLink = $('#codeLink');

    if (codeLink.attr('aria-current')) {
      codeLink.removeAttr('aria-current');
    }

    $('.selected:eq(0)').removeClass('selected');
    $('#homePage').addClass('selected');

    $('#readme').removeClass('hiddenDisplay');
  } else if (currentPage === 'code') {
    $('.selected:eq(0)').removeClass('selected');
    createAccordionLayout();
  }

  let pencilIconClass = '.octicon-pencil';

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

  const totalIcons = $('.helpIcon').length;

  if (totalIcons < 1 && currentPage === 'home') {
    const readmeIcon = new ToolTip(
      'H4',
      'helpIcon',
      'To edit this file, go to the "code" tab above, and select the file you want to edit.',
      pencilIconClass
    );

    readmeIcon.createIcon();

    $(readmeIcon.toolTipElement).insertAfter(readmeIcon.gitHubElement);
  }
}

/**
 * Function name: createForkedMessage
 * Creates green ribbon above files in repository after the repo has been forked
 */
function createForkedMessage() {
  const successRibbonContainer = document.createElement('div');
  successRibbonContainer.className = 'successRibbon text-center';

  const ribbonMessage = document.createTextNode(
    `The repository was successfully forked, feel free to contribute and add new files`
  );

  successRibbonContainer.appendChild(ribbonMessage);

  $(successRibbonContainer).insertBefore('.Box:eq(3)');

  chrome.storage.sync.set({ hasForked: false });
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
 * Function name: createAccordionLayout
 * Display files in repository inside an dropdown menu
 */
function createAccordionLayout() {
  try {
    $('.Box-header:eq(2)').addClass('accordion');
    $('.js-details-container:eq(2)').addClass('panel');
  } catch (error) {
    // do nothing
  }

  const $filesContainer = $('.Box:eq(3)');
  $filesContainer.removeClass('hiddenDisplay');

  $('.file-navigation:eq(0)').removeClass('hiddenDisplay');

  $('.Details-content--hidden-not-important:eq(1)').addClass('d-md-block');
  $('.file-navigation:eq(0)').addClass('d-flex');

  $('.selected:eq(0)').removeClass('selected');

  $('#codeLink').addClass('selected');
  $('#readme').addClass('hiddenDisplay');

  if (!document.location.pathname.includes('/upload/')) {
    const accordion = document.getElementsByClassName('accordion')[0];
    accordion.addEventListener('click', toggleAccordion);
  }
}

/**
 * Function name: toggleAccordion
 * Updates files to collapse and expand
 */
function toggleAccordion() {
  $('.accordion').toggleClass('active');
  const panel = document.getElementsByClassName('panel')[0];
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }

  // update title of each file within the github repository
  $('.js-details-container:eq(2) .link-gray-dark').each((index, element) => {
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
}

// global click listeners for home and code navbar links
$('#homePage').click((event) => {
  const currentLinkText = $('.selected:eq(0)').text().trim();
  if (currentLinkText === 'Home' || currentLinkText === 'Code') {
    event.preventDefault();
  }

  chrome.storage.sync.set({ activePage: 'home' });

  createHomePage();
});

$('#codeLink').click((event) => {
  const $currentLinkText = $('.selected:eq(0)').text().trim();

  if ($currentLinkText === 'Home' || $currentLinkText === 'Code') {
    event.preventDefault();
  }

  chrome.storage.sync.set({ activePage: 'code' });

  createHomePage();
});

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
 * Listen to page changes from the background
 */
chrome.runtime.onMessage.addListener((msg) => {
  const currentUrlPath = document.location.pathname;

  if (msg.type === 'UPDATE_REPO_LAYOUT') {
    if (currentUrlPath.includes('/blob/') && $('.helpIconCircle').length === 1) {
      updatePencilIcon();
    }

    createHomePageLink();
  }
});
