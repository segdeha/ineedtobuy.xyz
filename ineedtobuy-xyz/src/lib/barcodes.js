let fetchBarcodeInfo = barcode => {
    let url = `/api/lookup.php?barcode=${barcode}`;

    return fetch(url, { mode: 'cors' })
        .then(response => response.json())
        .then(result => {
            let item = {
                barcode: -1 // error state
            };

            if (result.items && result.items.length > 0) {
                let name = result.items[0].name;
                let image;
                if (result.items[0].largeImage) {
                    image = result.items[0].largeImage.replace(/\?.*/, '');
                }
                else {
                    image = '/img/groceries.svg';
                }
                item =  { barcode, name, image };
            }

            return item;
        });
};

export default fetchBarcodeInfo;
