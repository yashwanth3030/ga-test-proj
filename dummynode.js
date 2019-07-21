'use strict';

const express = require('express');
const mysql=require('mysql');
var app=express();
var bodyParser = require('body-parser');
const PORT = 3000;

var db_config = {
  host: "database-1.cpzshkki8zcm.ap-south-1.rds.amazonaws.com",
  user: 'admin',
  password: 'admin123',
  database: 'dummy_db'
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } else{
      console.log('evalbot_db connected');
    }                                    // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

app.get('/login/rollNoFind',function(req,resp){
  var rollNo=req.header('rollNo');
  if(rollNo){
    var selectsql = 'select * from USERS where user_rollno= ?';
    connection.query(selectsql,[rollNo],function(err,rows,fields){
      if (!!err){
        resp.sendStatus(400);
      }
      if(rows.length==0){
        resp.sendStatus(204);
      }
      else{
        resp.sendStatus(200);
      }
    });
  }else{
    resp.sendStatus(404);
  }
});
