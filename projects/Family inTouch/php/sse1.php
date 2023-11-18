<?php
    set_time_limit( 0 );
    ini_set('auto_detect_line_endings', 1);
    ini_set('mysql.connect_timeout','7200');
    ini_set('max_execution_time', '0');

    date_default_timezone_set( 'Europe/London' );
    ob_end_clean();
    gc_enable();



    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET');
    header('Access-Control-Expose-Headers: X-Events');  




    if( !function_exists('sse_message') ){
        function sse_message( $evtname='chat', $data=null, $retry=1000 ){
            if( !is_null( $data ) ){
                echo "event:".$evtname."\r\n";
                echo "retry:".$retry."\r\n";
                echo "data:" . json_encode( $data, JSON_FORCE_OBJECT|JSON_HEX_QUOT|JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS );
                echo "\r\n\r\n";    
            }
        }
    }

    $sleep=1;
    $c=1;

   $pdo=new dbpdo();/* wrapper class for PDO that simplifies using PDO */

    while( true ){
        if( connection_status() != CONNECTION_NORMAL or connection_aborted() ) {
            break;
        }
        /* Infinite loop is running - perform actions you need */

        /* Query database */
        /*
            $sql='select * from `table`';
            $res=$pdo->query($sql);
        */

        /* Process recordset from db */
        /*
        $payload=array();
        foreach( $res as $rs ){
            $payload[]=array('message'=>$rs->message);  
        }
        */

        /* prepare sse message */
        sse_message( 'chat', array('field'=>'blah blah blah','id'=>'XYZ','payload'=>$payload ) );

        /* Send output */
        if( @ob_get_level() > 0 ) for( $i=0; $i < @ob_get_level(); $i++ ) @ob_flush();
        @flush();

        /* wait */
        sleep( $sleep );
        $c++;

        if( $c % 1000 == 0 ){/* I used this whilst streaming twitter data to try to reduce memory leaks */
            gc_collect_cycles();
            $c=1;   
        }
    }



    if( @ob_get_level() > 0 ) {
        for( $i=0; $i < @ob_get_level(); $i++ ) @ob_flush();
        @ob_end_clean();
    }
?>