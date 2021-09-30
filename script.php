<?php

function validateX($x)
{
    $xArray = array(-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2);
    return isset($x) && is_numeric($x) && in_array($x, $xArray);
}

function validateY($y)
{
    $Y_MIN = -3;
    $Y_MAX = 5;
    return isset($y) && is_numeric($y) && ($y > $Y_MIN) && $y < $Y_MAX;
}

function validateR($r)
{
    $rArray = array(1, 2, 3, 4, 5);
    return isset($r) && is_numeric($r) && in_array($r, $rArray);
}

function validateData($x, $y, $r)
{
    return validateR($r) && validateX($x) && validateY($y);
}

function checkCircle($x, $y, $r)
{
    return $x >= 0 && $y >= 0 && $x <= $r / 2 && $y <= $r / 2 && sqrt($x * $x + $y * $y) <= $r / 2;
}

function checkTriangle($x, $y, $r)
{
    return $x >= 0 && $y <= 0 && $x <= $r / 2 && $y >= $x - $r / 2;
}

function checkRectangle($x, $y, $r)
{
    return $x <= 0 && $y >= 0 && -$x >= -$r / 2 && $y <= $r;
}

function checkHit($x, $y, $r)
{
    return checkCircle($x, $y, $r) || checkTriangle($x, $y, $r) || checkRectangle($x, $y, $r);
}

session_start();
$start = microtime(true);
date_default_timezone_set('Europe/Moscow');
$currentTime = date('m/d/Y h:i:s a', time());

$x = $_POST['x'];
$y = $_POST['y'];
$r = $_POST['r'];

$validation = validateData($x, $y, $r);
$hit = checkHit($x, $y, $r);
$responseHit = $hit ? 'true' : 'false';
$isValid = $validation ? 'true' : 'false';

$executionTime = number_format((float)microtime(true) - $start, 8, '.', '');

$data = "{" .
    "\"isValid\":\"$isValid\"," .
    "\"x\":\"$x\"," .
    "\"y\":\"$y\"," .
    "\"r\":\"$r\"," .
    "\"currentTime\":\"$currentTime\"," .
    "\"executionTime\":\"$executionTime\"," .
    "\"hit\":\"$responseHit\"" .
    "}";

if (!isset($_SESSION['results'])) {
    $_SESSION['results'] = array();
}
if ($isValid) array_push($_SESSION['results'], $data);
echo $data;