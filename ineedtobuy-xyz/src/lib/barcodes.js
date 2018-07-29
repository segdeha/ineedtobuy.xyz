let fetchBarcodeInfo = barcode => {
    let url = `/api/lookup.php?barcode=${barcode}`;

    return fetch(url, { mode: 'cors' })
        .then(response => response.json())
        .then(result => {
            let item = {
                barcode: -1 // error state
            };

            if (result.items.length > 0) {
                item =  {
                    barcode: barcode,
                    name: result.items[0].name,
                    image: result.items[0].largeImage && result.items[0].largeImage.split('?')[0] || '/img/groceries.svg'
                };
            }

            return item;
        });
};

export default fetchBarcodeInfo;
