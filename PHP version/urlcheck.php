<h1>Check Url </h1>

<?php
include 'dbconfig.php';
$p= $_GET["p"];
$query = mysql_query("SELECT * FROM urls  WHERE priority = ".$p." ORDER BY `urls`.`timestamp` DESC");
while ($rows = mysql_fetch_array($query)):
  ifAvailable($rows['id'],$rows['youtube_id'],$apiPublicKey);
endwhile;

function ifAvailable ($id,$videoID,$apiPublicKey){

$response = file_get_contents('https://www.googleapis.com/youtube/v3/videos?part=id&id='. $videoID . '&key='. $apiPublicKey);
$json = json_decode($response,true);

if (sizeof($json['items'])) {
    // video exists

    echo ' <div>'.$videoID.' Video exists & DB ID = '.$id.'</div>';
    mysql_query("UPDATE urls SET response='available' WHERE id=".$id);

} else {
    // video does not exist
    echo ' <div>'.$videoID.' <b> Video does not exist</b> & DB ID = '.$id.'<br>';
    mysql_query("UPDATE urls SET response='unavailable' WHERE id=".$id);

}
}

?>
