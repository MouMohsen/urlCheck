<?php
include 'dbconfig.php';

if(isset($_POST['submit']))
{
    $url = $_POST['url'];
    $priority = $_POST['priority'];
    parse_str( parse_url( $url, PHP_URL_QUERY ), $var );
    $youtube_id = $var['v'];
    echo $youtube_id, $priority;
    mysql_query ("INSERT INTO urls (youtube_id,priority) VALUES ('$youtube_id', '$priority')");

}

?>

<form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
   URL <input type="text" name="url" required><br>
  Priority <input type="number" name="priority" required><br>
   <input type="submit" name="submit" value="Submit Url"><br>
</form>
