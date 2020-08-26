updateLink();

/**
 * Function name: updateLink
 * Updates id of code link in nav bar
 */
function updateLink() {
  // add id to code link for easier access in DOM
  $('.selected:eq(0)').attr('id', 'codeLink');

  createHomePage();
}

$('#homePage').click(() => {
  if ($('.selected:eq(0)').text() !== 'Home') {
    createHomePage();
  }
});

$('#codeLink').click((event) => {
  event.preventDefault();
  createAccordionLayout();
});

/**
 * Function name: createHomePage
 * Updates the main page of a repository to only dispay readme file
 */
function createHomePage() {
  createHomePageLink();

  $('.selected:eq(0)').removeClass('selected');

  // toggle display for files in repo
  $('.Box:eq(3)').addClass('hiddenDisplay');
  $('.file-navigation:eq(0)').addClass('hiddenDisplay');

  $('.Details-content--hidden-not-important:eq(1)').removeClass('d-md-block');
  $('.file-navigation:eq(0)').removeClass('d-flex');

  const codeLink = $('#codeLink');

  if (codeLink.attr('aria-current')) {
    codeLink.removeAttr('aria-current');
  }

  $('#homePage').addClass('selected');

  if ($('#readme').hasClass('hiddenDisplay')) {
    $('#readme').removeClass('hiddenDisplay');
  }
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
    // silently abort
  }

  $('.Box:eq(3)').removeClass('hiddenDisplay');
  $('.file-navigation:eq(0)').removeClass('hiddenDisplay');

  $('.Details-content--hidden-not-important:eq(1)').addClass('d-md-block');
  $('.file-navigation:eq(0)').addClass('d-flex');

  $('.selected:eq(0)').removeClass('selected');

  $('#codeLink').addClass('selected');
  $('#readme').addClass('hiddenDisplay');

  const accordion = document.getElementsByClassName('accordion')[0];
  accordion.addEventListener('click', updateAccordion);
}

/**
 * Function name: updateAccordion
 * Updates files to collapse and expand
 */
function updateAccordion() {
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
  if (document.getElementById('homePage') === null) {
    const newNavLink = document.createElement('li');
    newNavLink.className = 'd-flex';

    newNavLink.innerHTML = `<a class="js-selected-navigation-item UnderlineNav-item hx_underlinenav-item no-wrap js-responsive-underlinenav-item" id="homePage" data-tab-item="code-tab"">Home</a>`;

    $('.UnderlineNav-body').prepend(newNavLink);
  }
}

/**
 * Listen to page changes from the background
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'UPDATE_REPO_LAYOUT') {
    createHomePageLink();
  }
});
