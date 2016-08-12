<?php
// actions

function getThingInfoFromBarcode($barcode) {
    global $app, $settings;

    echo '<pre>';var_dump($settings);exit;

    return array(
        'barcode' => $barcode
    );
}
