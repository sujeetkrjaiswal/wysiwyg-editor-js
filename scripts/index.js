(function () {
    // Colors List for our  color pallete
    var colorPalette = [
        '000000',
        '2c3e50',
        '34495e',
        '7f8c8d',
        '95a5a6',
        'ecf0f1',
        'ffffff',
        '16a085',
        '1abc9c',
        '27ae60',
        '2ecc71',
        '2980b9',
        '3498db',
        'f39c12',
        'f1c40f',
        'd35400',
        'e67e22',
        'c0392b',
        'e74c3c',
        '8e44ad',
    ]
    // CONSTANT for LOCALSTORAGE KEY for the editor
    var LS_KEY = 'jseditor_3y42d'

    /**
     * Editor reference is stored,as it will be every time whenever any
     * changes are done
     */
    var editor = document.getElementById('editor')

    /**
     * The flow for the editor is simple:
     * 1. Append pallete to the editor
     * 2. Second loadContent from the LocalStorage if available
     * 3. Add event listeners for all toolbar buttons and on editor change, to save the
     *      changes in localStorage
     */
    appendPaletteToEditor()
    loadFromLS()
    addListenersForEditorFunctionalities()

    /**
     * This is a utility method to append palette values in the DOM
     */
    function appendPaletteToEditor() {
        /**
         * The containers are accessed here and not in the outer scope
         * because they are only required once.
         * 
         * Also for appending the child, additonal Document fragment 
         * is created as it is faster to do multiple dom changes in memory with fragment
         * and append it at the end, whereas if dom changes are directly done on live dom,
         * it will be slower
         */
        var forePaletteContainer = document.getElementById('forePalette')
        var backPaletteContainer = document.getElementById('backPalette')

        var docFragForePalette = document.createDocumentFragment()
        var docFragBackPalette = document.createDocumentFragment()

        colorPalette.forEach(function (colorCode) {
            docFragForePalette.appendChild(getAnchor('forecolor', colorCode))
            docFragBackPalette.appendChild(getAnchor('backcolor', colorCode))
        })
        forePaletteContainer.appendChild(docFragForePalette)
        backPaletteContainer.appendChild(docFragBackPalette)
    }

    /**
     * 
     * @param {*} command 
     * @param {*} color 
     * 
     * An utility method to create UI element for toolbar.
     * It is specifically for creating Pallete entries
     */
    function getAnchor(command, color) {
        var elem = document.createElement('a')
        elem.className = "palette-item"
        elem.style.backgroundColor = '#' + color
        elem.setAttribute('data-command', command)
        elem.setAttribute('data-value', color)
        elem.href = '#'
        return elem
    }

    /**
     * 
     * @param {*} event 
     * This function is the method which gets executed when a button
     * of a toolbar is clicked.
     * 
     * This will read the value of data-command from the element and
     * then will execute that command
     */
    function toolbarBtnHandler(event) {
        var elem = this
        var command = elem.getAttribute('data-command')
        if (command == 'h1' || command == 'h2' || command == 'p') {
            document.execCommand('formatBlock', false, command);
        }
        if (command == 'forecolor' || command == 'backcolor') {
            document.execCommand(command, false, elem.getAttribute('data-value'));
        }
        if (command == 'createlink' || command == 'insertimage') {
            url = prompt('Enter the link here: ', 'http:\/\/');
            document.execCommand(command, false, url);
        } else document.execCommand(command, false, null);
    }

    /**
     * This method, attached event listeners to all
     * the buttons in the toolbar.
     * It also attaches listerner for editor, for event input and paste
     * So that it can save the value in localStorage
     */
    function addListenersForEditorFunctionalities() {
        var toolbarBtns = document.querySelectorAll('.toolbar a');
        for (var i = 0; i < toolbarBtns.length; i++) {
            toolbarBtns[i].addEventListener('click', toolbarBtnHandler)
        }
        editor.addEventListener('paste', saveContentToLS)
        editor.addEventListener('input', saveContentToLS)
    }

    /**
     * This is a utility method, which saves the editor content
     * into localStorage.
     * 
     * This methos is used by addListenersForEditorFunctionalities
     * for editor events like input, paste
     */
    function saveContentToLS() {
        localStorage.setItem(LS_KEY, editor.innerHTML)
    }
    /**
     * This method is a utility method which will load any
     * previously saved content.
     */
    function loadFromLS() {
        var data = localStorage.getItem(LS_KEY)
        if (data) {
            editor.innerHTML = data
        }
    }
}())