<?php 
include "dbcon.php";

if (isset($_POST['submit_client'])) {
	$client_id = filter_var($_POST['client_id'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_HIGH);
	$name = filter_var($_POST['name'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_HIGH);

	if ($_FILES['file']['size'] >0) {

		$file = $_FILES['file'];

		$fileName = $_FILES['file']['name'];
		$fileTmpName = $_FILES['file']['tmp_name'];
		$fileError = $_FILES['file']['error'];
		$fileSize = $_FILES['file']['size'];
		$fileExt = explode('.', $fileName);
		$fileActualExt = strtolower(end($fileExt));

        // echo $client_id;
        // echo $fileName;
		$allowed = array('pdf');

		if (in_array($fileActualExt, $allowed)) {
			if ($fileError === 0) {
				if ($fileSize < 1000000000) {

					$fileNameNew = uniqid('',true).".".$fileActualExt;
					$file_destination = './documents/'.$fileNameNew.'.'.$fileActualExt;

                    if (move_uploaded_file($fileTmpName, $file_destination)){

						$sql_reg = mysqli_query($link, "INSERT INTO documents(doc_name,type,unique_index,client_id) 
                        VALUES('$fileName','$fileActualExt','$fileNameNew','$client_id')") or die (mysqli_error($link));

					}

					echo "

					<script>
						if (confirm('Document successfully uploaded')) {
                            window.location = 'client_docs.php?id=$client_id&name=$name';
						}else{
                            window.location = 'client_docs.php?id=$client_id&name=$name';
						}
					</script>";
				}else{
					echo "

					<script>
						if (confirm('Sorry but the file is too large...')) {
                            window.location = 'client_docs.php?id=$client_id&name=$name';
						}else{
                            window.location = 'client_docs.php?id=$client_id&name=$name';
						}
					</script>";
				}
			}else{
				echo "

				<script>
					if (confirm('There was an error uploading the file. Please try again later...')) {
						window.location = 'client_docs.php?id=$client_id&name=$name';
					}else{
						window.location = 'client_docs.php?id=$client_id&name=$name';
					}
				</script>";
			}
		}else{
			echo "

			<script>
				if (confirm('Sorry but you cannot upload this type of file. Please try again using PDF format...')) {
					window.location = 'client_docs.php?id=$client_id&name=$name';
				}else{
					window.location = 'client_docs.php?id=$client_id&name=$name';
				}
			</script>";
		}

	}else{
			echo "

			<script>
				if (confirm('Document  was not uploaded, Please try again...')) {
					window.location = 'client_docs.php?id=$client_id&name=$name';
				}else{
					window.location = 'client_docs.php?id=$client_id&name=$name';
				}
			</script>";
    }
}
?>