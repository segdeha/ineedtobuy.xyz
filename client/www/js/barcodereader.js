/* jshint esversion: 6 */
/**
 * BarcodeReader
 * @requires Quagga
 * @requires jQuery
 */
var BarcodeReader = (function (window, document, $, undefined) {

    /**
     * @constructor
     */
    function BarcodeReader() {
        var self = this;
        $('#new-product .primary.button').click(function () {
            self._handleScannedProductClick(this);
        });
        $('#manual-product .primary.button').click(function () {
            self._handleManuallyEnteredProductClick(this)
        });
    }

    var proto = BarcodeReader.prototype;

    proto._handleScannedProductClick = function (button) {
        var $button = $(button);
        $button.addClass('loading');
        var thing_id = $('#new-product').attr('data-thing-id');
        this.saveNewThing($button, {
            thing_id: thing_id
        });
    };

    proto._handleManuallyEnteredProductClick = function (button) {
        var $button = $(button);
        $button.addClass('loading');
        var name = $('#manual-product [name="new-product-name"]').val();
        var barcode = $('#manual-product [name="barcode-result"]').val();
        this.saveNewThing($button, {
            thing_id: null,
            name: name,
            barcode: barcode
        });
    };

    proto.saveNewThing = function ($button, params) {
        var $modal = $button.parents('.modal');

        var $number_of_days = $('[name="number-of-days"]', $modal);
        var number_of_days = $number_of_days.val() || 7;

        var postData = Object.assign({
            user_id: USERID,
            purchase_id: null,
            token: TOKEN,
            estimated_number_of_days: number_of_days
        }, params);

        var posting = $.post({
            url: `${BASEURL}/api/purchase`,
            data: postData
        });
        posting.done(function (json) {
            TOKEN = json.data.token;
            // close modal
            $modal.modal('hide');
            // reset estimated number of days back to default
            $number_of_days.val(7);
            // thing saved successfully, get refreshed list
            window.list.fetch();
        });
        posting.fail(function (xhr) {
            rafAlert('Adding product failed. Try again.');
            if (401 === xhr.status) {
                window.location = 'index.html';
            }
        });
        posting.always(function () {
            $button.removeClass('loading');
        });
    };

    /**
     * Take picture using device camera and retrieve image as base64-encoded string
     */
    proto.capturePhoto = function () {
        navigator.camera.getPicture(this.onPhotoDataSuccess, this.onCaptureFail, {
            quality: 50,
            destinationType: navigator.camera.DestinationType.DATA_URL
        });
    };

    /**
     * Called when a photo is successfully retrieved
     * @param String imageData base64-encoded image data
     */
    proto.onPhotoDataSuccess = function (imageData) {
        var dimmer = document.querySelector('.dimmer');

        // show loading indicator
        dimmer.querySelector('.text').innerHTML = 'Deciphering barcode…';
        dimmer.classList.add('active');

        function callback(result) {
            var getting;

            // clear the 10 second timeout
            clearTimeout(timeout);

            function displayProductModal(data, edit) {
                var barcode = result && result.codeResult && result.codeResult.code || '00000000';

                // TODO if (edit) { put modal in edit mode }

                // save thing_id to the dom element
                $('#new-product').attr('data-thing-id', data.id);

                // display barcode value
                $('#barcode-result').html(result.codeResult.code);

                // set product info in modal
                $('#new-product .header').html(data.name);
                $('#new-product .content .image').attr('src', data.product_image || BASEURL + '/assets/img/default-image.png');

                // hide loading indicator
                dimmer.classList.remove('active');

                // show product modal
                $('#new-product').modal({ blurring: true }).modal('show');

                // update the range input
                rangeInput.update();
            }

            if(result.codeResult && result.codeResult.code) {
                displayProductModal = displayProductModal.bind(this);

                // update status for the user
                dimmer.querySelector('.text').innerHTML = 'Fetching product info…';

                getting = $.getJSON(`${BASEURL}/api/thing/${USERID}/${result.codeResult.code}/${TOKEN}`);
                getting.done(function (json) {
                    TOKEN = json.data.token;

                    var data = json.data.thing || {
                        id: 0,
                        name: 'Unknown Product',
                        product_image: BASEURL + '/assets/img/default-image.png'
                    };
                    data.product_image = data.product_image || BASEURL + '/assets/img/default-image.png';
                    // preload the image before showing the modal
                    var img = new Image();
                    img.onload = function () {
                        displayProductModal(data, !json.data);
                    };
                    img.src = data.product_image;
                });
                getting.fail(function (xhr) {
                    if (401 === xhr.status) {
                        window.location = 'index.html';
                    }
                });
            }
            else {
                noBarcode();
            }
        }

        function noBarcode() {
            // hide loading indicator
            dimmer.classList.remove('active');
            // put this in a RAF so the dimmer can hide before the alert shows
            rafAlert('No barcode detected. Try again.');
        }

        Quagga.decodeSingle({
            src: `data:image/jpeg;base64,${imageData}`,
            numOfWorkers: 2,
            decoder: {
                readers: [
                    // order matters, upc is most common in the usa
                    'upc_reader', 'upc_e_reader', 'ean_reader', 'ean_8_reader',
                    'code_128_reader', 'code_39_reader', 'code_39_vin_reader',
                    'codabar_reader', 'i2of5_reader',
                ] // List of active readers
            },
            locate: true, // try to locate the barcode in the image
        }, callback.bind(this));

        // stop trying to decipher the barcode after 10 seconds
        var timeout = setTimeout(function () {
            Quagga.stop();
            noBarcode();
        }, 15000);
    };

    /**
     * Called if image capture fails
     */
    proto.onCaptureFail = function (message) {
        // user probably hit 'cancel', fail silently
        // rafAlert('Image capture failed because: ' + message);
    };

    return BarcodeReader;

}(this, this.document, jQuery));
