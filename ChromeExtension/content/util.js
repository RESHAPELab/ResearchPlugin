function addProgressBar(currentStep, totalSteps, rootElement, stepsList) {
  const progressBarContainer = document.createElement("div");
  progressBarContainer.className = "container";

  const progressBar = document.createElement("div");
  progressBar.className = "progressbar";

  const progressBarSteps = document.createElement("ul");

  let index;

  for (index = 1; index <= stepsList.length; index += 1) {
    const progressBarStep = document.createElement("li");
    progressBarStep.innerHTML = stepsList[index - 1];
    progressBarStep.className = "partial";

    if (currentStep === totalSteps) {
      progressBarStep.className = "completed";
    } else if (index < currentStep) {
      progressBarStep.className = "partial completed";
    }

    progressBarSteps.appendChild(progressBarStep);
  }

  progressBar.appendChild(progressBarSteps);

  progressBarContainer.appendChild(progressBar);

  $(progressBarContainer).insertBefore(rootElement);

  if (isProcessCompleted()) {
    createSuccessRibbon();
  }
}

const createIcon = (text) => {
  const toolTipContainer = document.createElement("div");
  toolTipContainer.className = "helpIcon";

  toolTipContainer.innerHTML = `<span class="helpIconCircle">?</span>
                                  <span class="helpIconText">${text}</span>`;

  return toolTipContainer;
};

const createIconAfterElement = (text, gitHubElement) => {
  const toolTip = createIcon(text);
  $(toolTip).insertAfter(gitHubElement);
  return toolTip;
};

const createIconBeforeElement = (text, gitHubElement) => {
  const toolTip = createIcon(text);
  $(toolTip).insertBefore(gitHubElement);
  return toolTip;
};

const createIconAfterLastElement = (text, gitHubElement) => {
  const toolTip = createIcon(text);
  $(toolTip).insertAfter(gitHubElement).last();
  return toolTip;
};

/**
 * Custom jQuery function to toggle text
 */
$.fn.extend({
  toggleText(firstElement, secondElement) {
    return this.text(this.text() === secondElement ? firstElement : secondElement);
  },
});