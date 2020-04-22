//when the document is ready do the functions
//TODO: make it identify which methods to activate based on specific webpages.
$(document).ready(function() {
    readMe();
    compareChanges();
 });

 //Adds tooltips to the readMe page.
 function readMe()
 {
    var fileNameClass = "form-control js-blob-filename js-breadcrumb-nav mr-1 mt-1 mt-sm-0 col-12 width-sm-auto";
    var fileNameMessage = "This is the file name changing it will create a new file with the new name";
    addTooltip(fileNameClass,fileNameMessage,false); 
    //TODO: add some clickable links to somehow help? I will probably add it to
    //the icon on the top thats clickable

    var editFileClass = "btn-link code px-3 px-sm-6 px-lg-3 flex-1 flex-md-auto selected tabnav-tab js-blob-edit-code js-blob-edit-tab"
    var editFileMessage = "This is an editor in MarkDown format";
    addTooltip(editFileClass,editFileMessage);

    var previewChangesClass = "flex-1 flex-md-auto btn-link preview tabnav-tab js-blob-edit-preview js-blob-edit-tab";
    var previewChangesMessage = "Preview how the file will be displayed after interpreting the md file. \n This will not save the file it will only show the result."
    addTooltip(previewChangesClass,previewChangesMessage,false);

}

//Adds tooltips to the compare changes page.
function compareChanges()
{
    var baseRepoClass = "range-editor text-gray js-range-editor";
    var baseRepoMessage = "This represents the origin and destination of your changes if you are not sure, leave it how it is,\n this is common for small changes.";
    addTooltip(baseRepoClass,baseRepoMessage,false);

    var changesBoxClass = "js-diff-progressive-container";
    var changesBoxMessage = "This shows the changes between the orginal file (left) and your version (right).\n Green(+) represents lines added.\nRed(-) represents removed lines";
    addTooltip(changesBoxClass,changesBoxMessage,false);

    //This I cannot do because the path I took isnt matching its weird.
    var createPullClass = "";
    var createPullMessage = "";

    //lists the messages and classes for the bar showing the commits, filechanged, commit comments, and contributors.
    var barCommitFileChanged = "nolink";
    var barCommitMessage = "This shows the ammount of commits in the pull request.";
    var barFileChangedMessage = "this shows the amount of files you changed in the pull request.";
    var barCommitCommentsMessage = "This shows how many comments were on the commits for the pull request.";
    var barContributorMessage = "This is the ammount of people who worked together on this pull request.";
    var arrayBar = [barCommitMessage,barFileChangedMessage,barCommitCommentsMessage,barContributorMessage];
    addTooltip(barCommitFileChanged,arrayBar,true);
    //TODO: all the other cases to the compare changes page.
}

//Adds a tooltip with toolTipMessage to the first element if multiple is false else it will go through the amount of messages in a array and attach them to the corresponding class.
 function addTooltip(className,toolTipMessage,multiple)
 {
     //searches for elements with the classnames specified
     var elementClass = document.getElementsByClassName(className);

     //if it finds an element with those classes set the Attribute else do nothing.
     if(!multiple)
     {
        if(elementClass[0] != null)
        {
            //set the title attribute to the toolTipMessage.
            elementClass[0].setAttribute("title",toolTipMessage);
        }
    }
    else
    {
        //Loops throught the element classes and sets the corresponding tooltip message to the title.
        var i;
        for(i = 0; i < toolTipMessage.length; i++)
        {
            elementClass[i].setAttribute("title",toolTipMessage[i]);
        }

    }
 }

 //This will change the tooltips on the opened pull request page.
 function openedPullRequest()
 {
     //begining to get the classes and messages for this page.
     var closePullClass = "js-form-action-text";
     var closePullMessage = "This will close the pull request meaning people cannot view this! \n DO NOT CLICK UNLESS THE REQUEST WAS SOLVED.";

     var openGreenButtonClass = "State State--green";
     var openGreenButtonMessage = "This indicates that the pull request is open meaning someone will get to it soon."

    //TODO the rest of the cases for opened pull request page.
 }
