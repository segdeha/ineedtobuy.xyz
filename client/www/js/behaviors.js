/* jshint esversion: 6 */
(function (window, document, $, undefined) {

    window.BASEURL = 'https://ineedtobuy.xyz';

    window.rafAlert = function (str) {
        window.requestAnimationFrame(function () {
            alert(str);
        });
    }

    window.rangeInput = new RangeInput('number-of-days');

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
                        window.requestAnimationFrame(function () {
                            alert('Unknown user. Try again.');
                        });
                        return;
                    }

                    // set USERID globally
                    window.USERID = json.data.user.id;

                    // set TOKEN globally
                    window.TOKEN = json.data.token;

                    $('#login').fadeOut(250, function () {
                        $('#lists').addClass('show');
                        window.requestAnimationFrame(initLists);
                    });
                });
                posting.fail(function (json) {
                    // release the server connection before showing the alert
                    window.requestAnimationFrame(function () {
                        alert('Invalid login. Try again.');
                    });
                });
            }
        });

        $('#settings').on('click', function (evt) {
            $('#settings-modal').modal({ blurring: true }).modal('show');
        });
    }

    function initLists() {
        var barcodeReader = new BarcodeReader();
        $('#new-product-button').on('click', barcodeReader.capturePhoto.bind(barcodeReader));

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
                $('#product-info').modal('show');
            }
        });

        rangeInput.update();
    }

    function onDOMContentLoaded() {
        document.addEventListener('deviceready', onDeviceReady);
    }

    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

}(this, this.document, jQuery));
