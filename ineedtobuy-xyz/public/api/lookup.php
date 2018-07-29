<?php

$barcode = $_GET['barcode'];

if (preg_match('/^\d+$/', $barcode)) {
    $url = "https://api.walmartlabs.com/v1/items?format=json&apiKey=9dfd6wqaqah3headn7r9bks8&upc=$barcode";
    $mime = 'application/json';
	$options = array(
		CURLOPT_URL            => $url,
		CURLOPT_HEADER         => false,
		CURLOPT_RETURNTRANSFER => true,
	);

	$ch = curl_init();
	curl_setopt_array($ch, $options);
	$content = curl_exec($ch);
	curl_close($ch);

	header('Content-type: ' . $mime);
    echo $content;
    flush();
    exit;
}
