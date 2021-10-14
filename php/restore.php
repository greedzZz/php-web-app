<?php
session_start();
$data = "[";
if (isset($_SESSION['results'])) {
    foreach ($_SESSION['results'] as $result) {
        $data .= $result;
        $data .= ",";
    }
    if (strcmp(substr($data, strlen($data)), ",")) {
        $data = substr($data, 0, -1);
    }
}
$data .= "]";
echo $data;