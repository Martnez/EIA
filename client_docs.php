  <?php include "header.php";?>
  <?php include "dbcon.php";?>
  
  <?php 
    $id = filter_var($_GET['id'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_HIGH);
    $name = filter_var($_GET['name'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_HIGH);

    $query = mysqli_query($link, "SELECT * FROM clients WHERE id = $id") or die(mysqli_error($link));
    $row = mysqli_fetch_array($query);
  ?>

  <body>
    <div class="dash-container">
      <div class="dash-top">
        <div class="dash-top-right">
          <img src="./public/images/avatar.jpg" alt="Profile Image" />
          <h3>Hello <?php echo $name?></h3>
        </div>
      </div>
      <div class="dash-main">
        <div class="dash-main-top"></div>

        <div class="dash-main-body">
          <div class="upload-content">
            <h3 style="text-align: center;"><?php echo $row['firstName']?> <?php echo $row['lastName']?> Documents</h3>
            <form action="upload_client_doc.php" method="POST" id="fileForm" role="form" enctype="multipart/form-data"   class="upload_documents">
              <div class="upload-holder-all-holder">
                <label class="upload_file_all_label" for="upload_file_all">
                  Click to Select
                </label>
                <input
                  type="file"
                  name="file"
                  id="upload_file_all"
                  class="upload-files-input"
                />
                <p class="upload-files-input-info"></p>
                <input
                  type="text"
                  name="client_id"
                  style="display: none;"
                  value="<?php echo $id;?>"
                />
                <input
                  type="text"
                  name="name"
                  style="display: none;"
                  value="<?php echo $name;?>"
                />
              </div>

              <div class="btn-holder-upload">
                <button type="submit" name="submit_client" class="upload-files-server btn">Upload</button>
              </div>
            </form>

            <div class="documents-list">
              
            <?php
                $query = mysqli_query($link, "SELECT * FROM documents WHERE client_id =$id") or die(mysqli_error($link));
                while ($row = mysqli_fetch_array($query)) {
            ?>
              <div class="document-card">
                <div class="document-info-holder">
                  <h4>Name:</h4>
                  <h5><?php echo $row['doc_name'];?></h5>
                </div>
                <div class="document-info-holder">
                  <h4>Type:</h4>
                  <h5><?php echo $row['type'];?></h5>
                </div>
                <div class="options">
                  <form method="get" action="download.php">
                    <input type="text" name="file_name" value="<?php echo $row['unique_index'];?>" style="display: none;">
                    <button class="btn download-document" type="submit">Download!</button>
                  </form>
                  <!-- <a href="" class="download-document">Delete</a> -->
                </div>
              </div>

              
            <?php 
            }
            ?>
              
            </div>
          </div>
        </div>

        <div class="date-time">
          <h4>10:00 am 30th April 2021</h4>
        </div>
      </div>
      <div class="dash-side-pane">
        <div class="dash-side-pane-img">
          <img src="./public/images/eia_logo.png" alt="EIA Image" />
        </div>
        <ul class="links">
          <li><a href="http://localhost:3000/home" class="link">HOME</a></li>
          <li><a href="http://localhost:3000/dashboard" class="link active">CLIENTS</a></li>
          <li><a href="http://localhost:3000/underwriting" class="link">UNDERWRITING</a></li>
          <li><a href="http://localhost:3000/claims" class="link">CLAIMS</a></li>
          <li><a href="http://localhost:3000/credit" class="link">CREDIT</a></li>
          <li><a href="http://localhost:3000/reports" class="link">REPORTS</a></li>
        </ul>
        <ul class="links bottom">
          <li><a href="http://localhost:3000/logout" class="link">LOGOUT</a></li>
          <li><a href="http://localhost:3000/admin" class="link">ADMIN</a></li>
        </ul>
      </div>
    </div>
    <script>
      const file_upload = document.querySelector("#upload_file_all");
      file_upload.addEventListener("change", (e) => {
        // Get the selected file
        const [file] = e.target.files;
        // Get the file name and size
        const { name: fileName, size } = file;
        // Convert size in bytes to kilo bytes
        const fileSize = (size / 1000).toFixed(2);
        // Set the text content
        const fileNameAndSize = `${fileName} - ${fileSize}KB`;
        document.querySelector(".upload-files-input-info").textContent =
          fileNameAndSize;
      });
    </script>
  </body>
</html>

