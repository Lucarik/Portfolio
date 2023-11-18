<?php
// no normal requests
if ($_SERVER['HTTP_ACCEPT'] !== 'text/event-stream') {
    exit();
}

// make session read-only
session_start();
$group_id = $_SESSION['group_id'];
session_write_close();

// disable default disconnect checks
ignore_user_abort(true);

// set headers for stream
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Access-Control-Allow-Origin: *");

// Start db
$dbUser = get_cfg_var('dbUser');
$dbPass = get_cfg_var('dbPass');
$dbName = get_cfg_var('dbName');
//Initialize database connection
$db = new mysqli('localhost', $dbUser, $dbPass, $dbName);

//echo mysqli_connect_errno();  
if (mysqli_connect_errno()) {     
    echo 'Error: Could not connect to database.  Please try again later.';     
    exit;
} 

//$_SESSION['group_id'] = $group_id;
// a new stream or an existing one
$lastEventId = intval(isset($_SERVER["HTTP_LAST_EVENT_ID"]) ? $_SERVER["HTTP_LAST_EVENT_ID"] : 0);

if ($lastEventId === 0) {
    // resume from a previous event
    $lastEventId = intval(isset($_GET["lastEventId"]) ? $_GET["lastEventId"] : 0);
} 

echo ":".str_repeat(" ", 2048)."\n"; // Padding for IE
echo "retry: 2000\n";

// query initial data, or select by event id

$data = [
    [0, 0],
    [1, 5],
    [2, 15],
    [3, 45],
    [4, 34],
    [5, 21],
]; 

// mock we at event 6
//$lastEventId = 6;

// start stream
/*
//while (true) {

    // user disconnected, kill process
    if (connection_aborted()) {
        exit();
    } else {

    // force an update, normally you would assign ids to your events/data
    $ses_sql = mysqli_query($db,"SELECT Id from group_chat WHERE Group_id = '$group_id' ORDER BY date_made LIMIT 1;");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $latestEventId = $row['Id'];
    
    if (!empty($latestEventId) && $lastEventId < $latestEventId) {
        $ses_sql = mysqli_query($db, "SELECT c.Id, p.image_link, p.Username, c.message, c.date_made FROM group_chat AS c 
        JOIN person AS p ON p.Id = c.User_id JOIN guild AS g ON g.Id = c.Group_id WHERE g.id = '$group_id' ORDER BY date_made LIMIT 1;");
       
       // generate some data, use array_shift() before to limit array leght whilst rolling
        $data = [];

        $data[] = [
            'image_link' => $row['image_link'],
            'Username' => $row['Username'],
            'message' => $row['message'],
            'date_made' => $row['date_made']
        ];

        $lastEventId = $row['Id'];

        echo "id: " . $latestEventId . "\n";
        echo "event: message\n";
        echo "data: ".json_encode($data)."\n\n";

    } else {
        echo "event: ping\n";
    }
  }

  // flush buffer
  ob_flush();
  flush();

  // 2 second sleep
  sleep(2);
//}*/
?>