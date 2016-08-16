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
        $('#new-product .primary.button').click(function (evt) {
            var $button = $(this);
            $button.addClass('loading');
            var thing_id = $('#new-product').attr('data-thing-id');
            self.saveScannedThing(thing_id, $button);
        });
    }

    var proto = BarcodeReader.prototype;

    proto.saveScannedThing = function (thing_id, $button) {
        var self = this;
        var number_of_days = document.querySelector('[name="number-of-days"]');

        var postData = {
            user_id: USERID,
            thing_id: thing_id,
            purchase_id: null,
            token: TOKEN,
            estimated_number_of_days: number_of_days.value || 7
        };

        var posting = $.post({
            url: `${BASEURL}/api/purchase`,
            data: postData
        });
        posting.done(function (json) {
            TOKEN = json.data.token;

            // close modal
            $('#new-product').modal('hide');
            // reset estimated number of days back to default-image
            number_of_days.value = 7;
            // thing saved successfully, get refreshed list
            window.list.fetch();
        });
        posting.fail(function () {
            rafAlert('Adding product failed. Try again.');
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
                $('#new-product').modal('show');

                // update the range input
                rangeInput.update();
            }

            if(result.codeResult && result.codeResult.code) {
                displayProductModal = displayProductModal.bind(this);

                // update status for the user
                dimmer.querySelector('.text').innerHTML = 'Fetching product info…';

                getting = $.getJSON(`${BASEURL}/api/thing/${USERID}/${result.codeResult.code}/${TOKEN}`);
                getting.always(function (json) {
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
        rafAlert('Image capture failed because: ' + message);
    };

    return BarcodeReader;

}(this, this.document, jQuery));
