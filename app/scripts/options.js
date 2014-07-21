document.addEventListener('DOMContentLoaded', function () {


    /* Load options

        @
        @        @@@@    @@   @@@@@       @@@@  @@@@@  @@@@@ @  @@@@  @    @  @@@@
        @       @    @  @  @  @    @     @    @ @    @   @   @ @    @ @@   @ @
        @       @    @ @    @ @    @     @    @ @    @   @   @ @    @ @ @  @  @@@@
        @       @    @ @@@@@@ @    @     @    @ @@@@@    @   @ @    @ @  @ @      @
        @       @    @ @    @ @    @     @    @ @        @   @ @    @ @   @@ @    @
        @@@@@@@  @@@@  @    @ @@@@@       @@@@  @        @   @  @@@@  @    @  @@@@

*/


    var themeDdl = document.getElementById('theme'),
        modeDdl = document.getElementById('mode');

    chrome.storage.sync.get({
        theme: 'default',
        mode : 'htmlmixed'
    }, function (items) {
        themeDdl.value = items.theme;
        modeDdl.value = items.mode;
    });


    /* Save options

             @@@@@
            @     @   @@   @    @ @@@@@@      @@@@  @@@@@  @@@@@ @  @@@@  @    @  @@@@
            @        @  @  @    @ @          @    @ @    @   @   @ @    @ @@   @ @
             @@@@@  @    @ @    @ @@@@@      @    @ @    @   @   @ @    @ @ @  @  @@@@
                  @ @@@@@@ @    @ @          @    @ @@@@@    @   @ @    @ @  @ @      @
            @     @ @    @  @  @  @          @    @ @        @   @ @    @ @   @@ @    @
             @@@@@  @    @   @@   @@@@@@      @@@@  @        @   @  @@@@  @    @  @@@@

    */

    var selects = document.querySelectorAll('select');

    for (var i = selects.length - 1; i >= 0; i--) {

        selects[i].addEventListener('change', function () {

            var themeDdl = document.getElementById('theme'),
                modeDdl = document.getElementById('mode');

            chrome.storage.sync.set({
                theme: themeDdl.value,
                mode : modeDdl.value
            }, function () {

                var status = document.getElementById('status');

                status.textContent = 'Options saved.';

                setTimeout(function () {
                    status.textContent = '';
                }, 1000);

            });
        });

    }

});
