import ClassicEditor from './classic-build';
import '../../stylesheets/style_ckeditor.css';

function tabCapture(editor) {
    const view = editor.editing.view;
    const viewDocument = view.document;

    viewDocument.on( 'keydown', (evt, data) => {
        if( (data.keyCode == 9) && viewDocument.isFocused ) {
            editor.execute( 'input', { text: '    ' } );
            evt.stop();
            data.preventDefault();
            view.scrollToTheSelection();
        }
    } );
};

function defaultToolbar(inputField) {
    ClassicEditor
    .create(inputField)
    // .then( editor => console.log(editor.config.names()) )
    .then(editor => tabCapture(editor))
    .catch( error => console.error(error) );
};

function commentToolbar(inputField) {
    ClassicEditor
    .create(inputField, {
        removePlugins: [ 'Heading', 'Image', 'ImageToolbar', 'ImageViaURLEmbed', 'MediaEmbed' ],
        toolbar: [ 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'indent', 'outdent', '|', 'blockQuote', 'insertTable', 'undo', 'redo' ]
    })
    // .then( editor => console.log(editor.config.names()) )
    .catch( error => console.error(error) );
};

function heroDescToolbar(inputField) {
    ClassicEditor
    .create(inputField, {
        removePlugins: [ 'EasyImage', 'Image', 'ImageToolbar', 'ImageViaURLEmbed', 'MediaEmbed' ],
        toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'indent', 'outdent', '|', 'blockQuote', 'insertTable', 'undo', 'redo' ]
    })
    .then(editor => tabCapture(editor))
    .catch(error => console.error(error));
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-ckeditor').forEach(inputField => {
        if(inputField.dataset.ckeditor == 'default') { defaultToolbar(inputField); }
        else if(inputField.dataset.ckeditor == 'comment') { commentToolbar(inputField); }
        else if(inputField.dataset.ckeditor == 'herodesc') { heroDescToolbar(inputField); }
    });
    // console.log(ClassicEditor.builtinPlugins.map(plugin => plugin.pluginName))
});
