<?php
// PayPal IPN Handler
$raw_post_data = file_get_contents('php://input');
$raw_post_array = explode('&', $raw_post_data);
$myPost = array();

foreach ($raw_post_array as $keyval) {
    $keyval = explode('=', $keyval);
    if (count($keyval) == 2) {
        $myPost[$keyval[0]] = urldecode($keyval[1]);
    }
}

// Read the post from PayPal and add 'cmd'
$req = 'cmd=_notify-validate';
foreach ($myPost as $key => $value) {
    $value = urlencode($value);
    $req .= "&$key=$value";
}

// Post back to PayPal to validate
$ch = curl_init('https://ipnpb.paypal.com/cgi-bin/webscr');
curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
curl_setopt($ch, CURLOPT_SSLVERSION, 6);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: Close'));

$res = curl_exec($ch);
curl_close($ch);

if (strcmp($res, "VERIFIED") == 0) {
    // Check payment details
    $payment_status = $_POST['payment_status'];
    $payment_amount = $_POST['mc_gross'];
    $payment_currency = $_POST['mc_currency'];
    $txn_id = $_POST['txn_id'];
    $receiver_email = $_POST['receiver_email'];
    $payer_email = $_POST['payer_email'];

    // Verify the payment is valid
    if ($payment_status == "Completed" && 
        $payment_amount == "19.00" && 
        $payment_currency == "EUR") {
        
        // Generate access code
        $access_code = generateAccessCode();
        
        // Send email with access code
        $to = $payer_email;
        $subject = "Your Access Code for Owl of Profit Trading Strategies";
        $message = "Thank you for your purchase!\n\n";
        $message .= "Your access code is: " . $access_code . "\n\n";
        $message .= "You can use this code on our website to access all trading strategies.\n";
        $message .= "If you have any questions, please contact us.\n\n";
        $message .= "Best regards,\nOwl of Profit Team";
        
        mail($to, $subject, $message);
        
        // Log the successful payment
        file_put_contents('payments.log', 
            date('Y-m-d H:i:s') . " Payment received: $payment_amount $payment_currency from $payer_email\n", 
            FILE_APPEND);
    }
}

function generateAccessCode() {
    return 'OWL-OF-PROFIT-' . strtoupper(substr(md5(uniqid()), 0, 8));
}
?> 