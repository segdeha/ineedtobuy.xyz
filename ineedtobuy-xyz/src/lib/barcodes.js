let fetchBarcodeInfo = barcode => {
    let url = `/api/lookup.php?barcode=${barcode}`;

    return fetch(url, { mode: 'cors' })
        .then(response => response.json())
        .then(items => {
            let item = {
                barcode: -1 // error state
            };
            if (items.length > 0) {
                item =  {
                    barcode: barcode,
                    name: items[0].name,
                    image: items[0].largeImage && items[0].largeImage.split('?')[0] || '/img/groceries.svg'
                };
            }
            return item;
        });
};

export default fetchBarcodeInfo;
