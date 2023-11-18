<?php

    session_start();

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
    $user = $_SESSION['login_user'];
    $group_id = $_SESSION['group_id'];
    
    // Get id
    $ses_sql = mysqli_query($db,"select Id from person where Username = '$user' ");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $user_id = $row['Id'];
    
    // Gets newest 30 posts from current group
    $result = $db->query("SELECT c.Id, p.image_link, p.Username, c.message, c.date_made FROM group_chat AS c 
    JOIN person AS p ON p.Id = c.User_id JOIN guild AS g ON g.Id = c.Group_id WHERE g.id = '$group_id' ORDER BY date_made LIMIT 30;");
    $num_results = $result->num_rows;

    if ($num_results == 0) {
        echo '<p class=sqlpara>Nothing in chat so far. Be the first to start a conversation!';
    } //else echo 'Number of results: '.$num_results;
    for ($i=0; $i <$num_results; $i++) {     
        $row = $result->fetch_assoc();
        echo '<span class="group-post">';
        echo '<img src="images/'.($row['image_link']).'" class="group-chat-picture" alt="Profile Picture">';
        echo '<span class="group-text-content">';
        echo '<p class="group-chat-username">'.($row['Username']).'</p>';
        echo '<p class="chat-content">'.($row['message']).'</p>';
        echo '</span>';
        echo '<span class="group-timestamp">';

        // Edit date format
        $date_raw = $row['date_made'];
        $iTimestamp = strtotime($date_raw); 
        $date = date("M. jS, H:i", $iTimestamp);

        echo '<p class="timestamp">'.$date.'</p>';
        echo '</span>';
        echo '</span>';

        if ($i == $num_results - 1) {
            $_SESSION['last_message_id'] = $row['Id'];
        }
    }

?>