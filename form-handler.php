<?php
/**
 * Contact form handler
 * - Validates and sanitizes all input
 * - Strips CR/LF to prevent email header injection
 */

function clean_field($value) {
    $value = trim($value ?? '');
    // Strip carriage returns / newlines (raw + URL-encoded) to prevent header injection
    $value = str_replace(["\r", "\n", "%0a", "%0d", "%0A", "%0D"], '', $value);
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

// Basic honeypot check (add a hidden input named "website" to the form;
// real users never fill it in, bots usually do)
if (!empty($_POST['website'])) {
    header("Location: contact.html");
    exit;
}

$name          = clean_field($_POST['name'] ?? '');
$visitor_email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$subject       = clean_field($_POST['subject'] ?? '');
$message       = clean_field($_POST['message'] ?? '');

if ($name === '' || !$visitor_email || $message === '') {
    http_response_code(400);
    exit('Please fill in your name, a valid email, and a message.');
}

$email_from    = 'info@mediaonafricalh.com'; // domain
$email_subject = 'New Form Submission';
$to            = 'lungadyantyi8@gmail.com';

$email_body = "User Name: $name.\n" .
              "User Email: $visitor_email.\n" .
              "Subject: $subject.\n" .
              "User Message: $message.\n";

$headers  = "From: $email_from\r\n";
$headers .= "Reply-To: $visitor_email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

mail($to, $email_subject, $email_body, $headers);

header("Location: contact.html");
exit;