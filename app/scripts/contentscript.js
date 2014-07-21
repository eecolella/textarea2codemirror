(function () {


    /* Load options

    @
    @        @@@@    @@   @@@@@       @@@@  @@@@@  @@@@@ @  @@@@  @    @  @@@@
    @       @    @  @  @  @    @     @    @ @    @   @   @ @    @ @@   @ @
    @       @    @ @    @ @    @     @    @ @    @   @   @ @    @ @ @  @  @@@@
    @       @    @ @@@@@@ @    @     @    @ @@@@@    @   @ @    @ @  @ @      @
    @       @    @ @    @ @    @     @    @ @        @   @ @    @ @   @@ @    @
    @@@@@@@  @@@@  @    @ @@@@@       @@@@  @        @   @  @@@@  @    @  @@@@

*/

    var options;
    chrome.storage.sync.get({
        theme: 'default',
        mode : 'htmlmixed'
    }, function (items) {
        options = items;
    });


    /* event keypress


        @@@@@@ @    @ @@@@@@ @    @ @@@@@     @   @ @@@@@@ @   @ @@@@@  @@@@@  @@@@@@  @@@@   @@@@
        @      @    @ @      @@   @   @       @  @  @       @ @  @    @ @    @ @      @      @
        @@@@@  @    @ @@@@@  @ @  @   @       @@@   @@@@@    @   @    @ @    @ @@@@@   @@@@   @@@@
        @      @    @ @      @  @ @   @       @ @   @        @   @@@@@  @@@@@  @           @      @
        @       @  @  @      @   @@   @       @  @  @        @   @      @   @  @      @    @ @    @
        @@@@@@   @@   @@@@@@ @    @   @       @   @ @@@@@@   @   @      @    @ @@@@@@  @@@@   @@@@
    */


    var flagFirstTime = true;

    window.addEventListener('keydown', function (e) {
        var el = document.activeElement;

        if ((e.keyCode == 119 || e.keyCode == 120) && el.nodeName == 'TEXTAREA') { //F8 (normal) or F9 (merge)

            if (!isInsideCodeMirror(el)) {

                var mw, editor, settings = {
                    value               : el.value,
                    orig                : el.value,
                    highlightDifferences: true,
                    mode                : options.mode,
                    theme               : options.theme,
                    lineNumbers         : true,
                    lineWrapping        : true,
                    styleActiveLine     : true,
                    foldGutter          : true,
                    autoCloseTags       : true,
                    indentUnit          : 4,
                    gutters             : ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                    extraKeys           : {
                        'Esc'  : function (cm) { // close and save
                            el.value = cm.getValue();

                            if (e.keyCode == 119) {  //F8 normal
                                cm.toTextArea();
                            } else { //F98 merge
                                document.body.removeChild(document.querySelector('.CodeMirror-merge'));
                            }

                            document.body.removeChild(document.querySelector('#cmBar'));
                            el.select();
                        },
                        'Alt-Q': function (cm) { // folding
                            cm.foldCode(cm.getCursor());
                        }
                    }
                };

                if (e.keyCode == 119) {  //F8 normal

                    // init editor
                    editor = CodeMirror.fromTextArea(el, settings);

                    makeItFullScreen(editor.display.wrapper);

                } else { //F9 merge

                    // init editor
                    mw = CodeMirror.MergeView(document.body, settings);
                    editor = mw.edit;

                    editor.execCommand('selectAll');

                    makeItFullScreen(document.querySelector('.CodeMirror-merge'), document.querySelectorAll('.CodeMirror-merge .CodeMirror'));
                }

                softWrap(editor);

                editor.focus();

                createBar();

                if (flagFirstTime)
                    createStyleForBar();

                var modeDdl = document.querySelector('#cmBar select');

                modeDdl.value = options.mode;

                modeDdl.addEventListener('change', function () {

                    editor.setOption('mode', this.value);

                });

                flagFirstTime = false;

            }

        }

    }, false);


    /* isInsideCodeMirror

                     @@@                                @@@@@                       @     @
            @  @@@@   @  @    @  @@@@  @ @@@@@  @@@@@@ @     @  @@@@  @@@@@  @@@@@@ @@   @@ @ @@@@@  @@@@@   @@@@  @@@@@
            @ @       @  @@   @ @      @ @    @ @      @       @    @ @    @ @      @ @ @ @ @ @    @ @    @ @    @ @    @
            @  @@@@   @  @ @  @  @@@@  @ @    @ @@@@@  @       @    @ @    @ @@@@@  @  @  @ @ @    @ @    @ @    @ @    @
            @      @  @  @  @ @      @ @ @    @ @      @       @    @ @    @ @      @     @ @ @@@@@  @@@@@  @    @ @@@@@
            @ @    @  @  @   @@ @    @ @ @    @ @      @     @ @    @ @    @ @      @     @ @ @   @  @   @  @    @ @   @
            @  @@@@  @@@ @    @  @@@@  @ @@@@@  @@@@@@  @@@@@   @@@@  @@@@@  @@@@@@ @     @ @ @    @ @    @  @@@@  @    @
    */


    function isInsideCodeMirror(el) {
        var flag = false,
            p = el.parentNode;

        while (p !== document) {
            if (p.className.match(/CodeMirror/) !== null) {
                flag = true;
                break;
            }
            p = p.parentNode;
        }

        return flag;
    }


    /* softWrap

                                       @     @
             @@@@   @@@@  @@@@@@ @@@@@ @  @  @ @@@@@    @@   @@@@@
            @      @    @ @        @   @  @  @ @    @  @  @  @    @
             @@@@  @    @ @@@@@    @   @  @  @ @    @ @    @ @    @
                 @ @    @ @        @   @  @  @ @@@@@  @@@@@@ @@@@@
            @    @ @    @ @        @   @  @  @ @   @  @    @ @
             @@@@   @@@@  @        @    @@ @@  @    @ @    @ @
    */


    function softWrap(editor) {

        /*  ====================== Soft Wrap ==  */
        /*  ===================================  */
        var charWidth = editor.defaultCharWidth(), basePadding = 4;
        editor.on('renderLine', function (cm, line, elt) {
            var off = CodeMirror.countColumn(line.text, null, cm.getOption('tabSize')) * charWidth;
            elt.style.textIndent = '-' + off + 'px';
            elt.style.paddingLeft = (basePadding + off) + 'px';
        });
        editor.refresh();
    }


    /* makeItFullScreen

                                   @@@       @@@@@@@                       @@@@@
        @    @   @@   @   @ @@@@@@  @  @@@@@ @       @    @ @      @      @     @  @@@@  @@@@@  @@@@@@ @@@@@@ @    @
        @@  @@  @  @  @  @  @       @    @   @       @    @ @      @      @       @    @ @    @ @      @      @@   @
        @ @@ @ @    @ @@@   @@@@@   @    @   @@@@@   @    @ @      @       @@@@@  @      @    @ @@@@@  @@@@@  @ @  @
        @    @ @@@@@@ @ @   @       @    @   @       @    @ @      @            @ @      @@@@@  @      @      @  @ @
        @    @ @    @ @  @  @       @    @   @       @    @ @      @      @     @ @    @ @   @  @      @      @   @@
        @    @ @    @ @   @ @@@@@@ @@@   @   @        @@@@  @@@@@@ @@@@@@  @@@@@   @@@@  @    @ @@@@@@ @@@@@@ @    @
    */


    function makeItFullScreen(container, subContainers) {

        var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 30 + 'px';
        container.style.position = 'fixed';
        container.style.top = '30px';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = height;

        if (subContainers) {
            subContainers[0].style.height = height;
            subContainers[1].style.height = height;
        }

    }


    /* createBar

                                                     @@@@@@
             @@@@  @@@@@  @@@@@@   @@   @@@@@ @@@@@@ @     @   @@   @@@@@
            @    @ @    @ @       @  @    @   @      @     @  @  @  @    @
            @      @    @ @@@@@  @    @   @   @@@@@  @@@@@@  @    @ @    @
            @      @@@@@  @      @@@@@@   @   @      @     @ @@@@@@ @@@@@
            @    @ @   @  @      @    @   @   @      @     @ @    @ @   @
             @@@@  @    @ @@@@@@ @    @   @   @@@@@@ @@@@@@  @    @ @    @
    */


    function createBar() {

        var div = document.createElement('div');
        div.setAttribute('id', 'cmBar');

        var themeDdl = "";

        themeDdl += "<span>language: </span>";
        themeDdl += "<select>";
        themeDdl += "    <option>apl<\/option>";
        themeDdl += "    <option>asterisk<\/option>";
        themeDdl += "    <option>clike<\/option>";
        themeDdl += "    <option>clojure<\/option>";
        themeDdl += "    <option>cobol<\/option>";
        themeDdl += "    <option>coffeescript<\/option>";
        themeDdl += "    <option>commonlisp<\/option>";
        themeDdl += "    <option>css<\/option>";
        themeDdl += "    <option>cypher<\/option>";
        themeDdl += "    <option>d<\/option>";
        themeDdl += "    <option>diff<\/option>";
        themeDdl += "    <option>django<\/option>";
        themeDdl += "    <option>dtd<\/option>";
        themeDdl += "    <option>dylan<\/option>";
        themeDdl += "    <option>ecl<\/option>";
        themeDdl += "    <option>eiffel<\/option>";
        themeDdl += "    <option>erlang<\/option>";
        themeDdl += "    <option>fortran<\/option>";
        themeDdl += "    <option>gas<\/option>";
        themeDdl += "    <option>gfm<\/option>";
        themeDdl += "    <option>gherkin<\/option>";
        themeDdl += "    <option>go<\/option>";
        themeDdl += "    <option>groovy<\/option>";
        themeDdl += "    <option>haml<\/option>";
        themeDdl += "    <option>haskell<\/option>";
        themeDdl += "    <option>haxe<\/option>";
        themeDdl += "    <option>htmlembedded<\/option>";
        themeDdl += "    <option>htmlmixed<\/option>";
        themeDdl += "    <option>http<\/option>";
        themeDdl += "    <option>jade<\/option>";
        themeDdl += "    <option>javascript<\/option>";
        themeDdl += "    <option>jinja2<\/option>";
        themeDdl += "    <option>julia<\/option>";
        themeDdl += "    <option>livescript<\/option>";
        themeDdl += "    <option>lua<\/option>";
        themeDdl += "    <option>markdown<\/option>";
        themeDdl += "    <option>mirc<\/option>";
        themeDdl += "    <option>mllike<\/option>";
        themeDdl += "    <option>nginx<\/option>";
        themeDdl += "    <option>ntriples<\/option>";
        themeDdl += "    <option>octave<\/option>";
        themeDdl += "    <option>pascal<\/option>";
        themeDdl += "    <option>pegjs<\/option>";
        themeDdl += "    <option>perl<\/option>";
        themeDdl += "    <option>php<\/option>";
        themeDdl += "    <option>properties<\/option>";
        themeDdl += "    <option>puppet<\/option>";
        themeDdl += "    <option>python<\/option>";
        themeDdl += "    <option>q<\/option>";
        themeDdl += "    <option>r<\/option>";
        themeDdl += "    <option>rpm<\/option>";
        themeDdl += "    <option>rst<\/option>";
        themeDdl += "    <option>ruby<\/option>";
        themeDdl += "    <option>rust<\/option>";
        themeDdl += "    <option>sass<\/option>";
        themeDdl += "    <option>scheme<\/option>";
        themeDdl += "    <option>shell<\/option>";
        themeDdl += "    <option>sieve<\/option>";
        themeDdl += "    <option>smalltalk<\/option>";
        themeDdl += "    <option>smarty<\/option>";
        themeDdl += "    <option>smartymixed<\/option>";
        themeDdl += "    <option>solr<\/option>";
        themeDdl += "    <option>sparql<\/option>";
        themeDdl += "    <option>sql<\/option>";
        themeDdl += "    <option>stex<\/option>";
        themeDdl += "    <option>tcl<\/option>";
        themeDdl += "    <option>tiddlywiki<\/option>";
        themeDdl += "    <option>tiki<\/option>";
        themeDdl += "    <option>toml<\/option>";
        themeDdl += "    <option>turtle<\/option>";
        themeDdl += "    <option>vb<\/option>";
        themeDdl += "    <option>vbscript<\/option>";
        themeDdl += "    <option>velocity<\/option>";
        themeDdl += "    <option>verilog<\/option>";
        themeDdl += "    <option>xml<\/option>";
        themeDdl += "    <option>xquery<\/option>";
        themeDdl += "    <option>yaml<\/option>";
        themeDdl += "    <option>z80<\/option>";
        themeDdl += "<\/select>";
        div.innerHTML = themeDdl;

        document.body.appendChild(div);
    }


    /* createStyleForBar

                                                      @@@@@                            @@@@@@@               @@@@@@
             @@@@  @@@@@  @@@@@@   @@   @@@@@ @@@@@@ @     @ @@@@@ @   @ @      @@@@@@ @        @@@@  @@@@@  @     @   @@   @@@@@
            @    @ @    @ @       @  @    @   @      @         @    @ @  @      @      @       @    @ @    @ @     @  @  @  @    @
            @      @    @ @@@@@  @    @   @   @@@@@   @@@@@    @     @   @      @@@@@  @@@@@   @    @ @    @ @@@@@@  @    @ @    @
            @      @@@@@  @      @@@@@@   @   @            @   @     @   @      @      @       @    @ @@@@@  @     @ @@@@@@ @@@@@
            @    @ @   @  @      @    @   @   @      @     @   @     @   @      @      @       @    @ @   @  @     @ @    @ @   @
             @@@@  @    @ @@@@@@ @    @   @   @@@@@@  @@@@@    @     @   @@@@@@ @@@@@@ @        @@@@  @    @ @@@@@@  @    @ @    @
    */


    function createStyleForBar() {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            rules = '';
        rules += '#cmBar{';
        rules += '  width: 100%; ';
        rules += '  height: 30px; ';
        rules += '  line-height: 30px; ';
        rules += '  position: fixed; ';
        rules += '  top: 0; ';
        rules += '  left: 0; ';
        rules += '  background: #f8f8f8;';
        rules += '  text-align: right;';
        rules += '  border-bottom: 1px solid #ddd;';
        rules += '  z-index:9991;';
        rules += '}';
        rules += '#cmBar select{';
        rules += '  height: 18px;';
        rules += '  font-size: 12px;';
        rules += '  background: #f8f8f8;';
        rules += '  margin-right: 3px;';
        rules += '}';
        rules += '#cmBar span{';
        rules += '  font-size: 12px;';
        rules += '  font-family: arial;';
        rules += '}';
        rules += '.CodeMirror-merge, .CodeMirror{';
        rules += '  z-index:9990;';
        rules += '}';

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = rules;
        } else {
            style.appendChild(document.createTextNode(rules));
        }

        head.appendChild(style);
    }

})();
