/* jshint esversion: 6 */
(function (window, document, $, undefined) {

    // globals (yeah, ugh)
    window.BASEURL = 'https://ineedtobuy.xyz';
    window.USERID  = null;
    window.TOKEN   = null;

    // tired of typing it all out
    window.raf = window.requestAnimationFrame;

    window.rafAlert = function (str) {
        raf(function () {
            alert(str);
        });
    }

    window.newProductRangeInput    = new RangeInput('new-product-number-of-days');
    window.manualProductRangeInput = new RangeInput('manual-product-number-of-days');

    function onDeviceReady() {
        $('.ui.form').form({
            fields: {
                email: {
                    identifier  : 'username',
                    rules: [
                        { type : 'empty', prompt : 'Enter your username' }
                    ]
                },
                password: {
                    identifier  : 'password',
                    rules: [
                        { type : 'empty', prompt : 'Please enter your password' },
                        { type : 'length[6]', prompt : 'Your password must be at least 6 characters' }
                    ]
                }
            }
        });

        $('.ui.form').submit(function (evt) {
            evt.preventDefault();
            if (null === document.querySelector('.field.error')) {
                // TODO make ajax call to authenticate, then do the below
                var username = $('#login [name=username]');
                var password = $('#login [name=password]');

                // hide the keyboard
                username.blur();
                password.blur();

                var posting = $.post({
                    url: $(this).attr('action'),
                    data: {
                        username: username.val(),
                        password: password.val()
                    },
                    dataType: 'json'
                });
                posting.done(function (json) {
                    if (!json.data || !json.data.token || !json.data.user) {
                        // release the server connection before showing the alert
                        rafAlert('Unknown user. Try again.');
                        return;
                    }

                    // set USERID globally
                    USERID = json.data.user.id;

                    // set TOKEN globally
                    TOKEN = json.data.token;

                    $('#login').fadeOut(250, function () {
                        $('#lists').addClass('show');
                        raf(initLists);
                    });
                });
                posting.fail(function (json) {
                    // release the server connection before showing the alert
                    rafAlert('Invalid login. Try again.');
                });
            }
        });

        $('#settings').on('click', function (evt) {
            $('#settings-modal').modal({ blurring: true }).modal('show');
        });
    }

    function initLists() {
        $('#link-enter-new-product').on('click', function (evt) {
            evt.preventDefault();
            manualProductRangeInput.update();
            $('#manual-product').modal({ blurring: true }).modal('show');
        });

        var barcodeReader = new BarcodeReader();
        $('#link-scan-barcode').on('click', function (evt) {
            evt.preventDefault();
            $('#settings-modal').modal('hide');
            raf(barcodeReader.capturePhoto.bind(barcodeReader));
        });

        // fetch the list for the first time
        ReorderableList.prototype.fetch();

        // fetch new set of results when user hits refresh
        $('#refresh').click(function (evt) {
            $(this).addClass('loading');
            ReorderableList.prototype.fetch();
        });

        $('.active .list').on('click', function (evt) {
            var item, name, last_purchased, src;
            if (evt.target.matches('.header') || evt.target.matches('.description')) {
                item = $(evt.target).parents('.item');

                // get name of item from .header
                name = $('.header', item).html();
                $('#product-info .header').html(name);

                // get last purchased from .description
                last_purchased = $('.description', item).html();
                $('#product-info .last-purchased').html(last_purchased);

                // get image source from div.item[data-src]
                src = item.attr('data-src') || BASEURL + '/assets/img/default-image.png';
                $('#product-info .image').attr('src', src);

                // show modal
                $('#product-info').modal({ blurring: true }).modal('show');
            }
        });

        // TODO do these really need to be here?
        newProductRangeInput.update();
        manualProductRangeInput.update();
    }

    function onDOMContentLoaded() {
        document.addEventListener('deviceready', onDeviceReady);
    }

    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

}(this, this.document, jQuery));
