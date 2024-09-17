<?php
$filename = filter_var($_GET['file_name'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_HIGH);
$file = "./documents/".$filename;

header('Content-type: application/octet-stream');
header("Content-Type: ".mime_content_type($file));
header("Content-Disposition: attachment; filename=".$filename);
while (ob_get_level()) {
    ob_end_clean();
}
readfile($file);
?>