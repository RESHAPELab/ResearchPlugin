//when the document is ready do the functions
//TODO: make it identify which methods to activate based on specific webpages.
$(document).ready(function() {
    readMe();
 });

 //Adds tooltips to the readMe page.
 function readMe()
 {
    var fileNameClass = "form-control js-blob-filename js-breadcrumb-nav mr-1 mt-1 mt-sm-0 col-12 width-sm-auto";
    var fileNameMessage = "This is the file name changing it will create a new file with the new name";
    addTooltip(fileNameClass,fileNameMessage); 
    //TODO: add some clickable links to somehow help? I will probably add it to
    //the icon on the top thats clickable

    var editFileClass = "btn-link code px-3 px-sm-6 px-lg-3 flex-1 flex-md-auto selected tabnav-tab js-blob-edit-code js-blob-edit-tab"
    var editFileMessage = "This is an editor in MarkDown format";
    addTooltip(editFileClass,editFileMessage);

    var previewChangesClass = "flex-1 flex-md-auto btn-link preview tabnav-tab js-blob-edit-preview js-blob-edit-tab";
    var previewChangesMessage = "Preview how the file will be displayed after interpreting the md file. \n This will not save the file it will only show the result."
    addTooltip(previewChangesClass,previewChangesMessage);

}

//Adds tooltips to the compare changes page.
function compareChanges()
{
    var baseRepoClass = "range-editor text-gray js-range-editor is-cross-repo";
    //TODO: all the other cases to the compare changes page.
}

//Adds a tooltip with toolTipMessage to the first element with all the class names on the DOM
 function addTooltip(className,toolTipMessage)
 {
     //searches for elements with the classnames specified
     var elementClass = document.getElementsByClassName(className);

     //if it finds an element with those classes set the Attribute else do nothing.
     if(elementClass[0] != null)
     {
         //set the title attribute to the toolTipMessage.
        elementClass[0].setAttribute("title",toolTipMessage);
     }
 }
