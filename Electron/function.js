
function display_projects(){
  var mysql = require('mysql');

  connect(function(rows){
    var html = '';

    rows.forEach(function(row){
      html += '<div class="project" data-project="' + row.nom + '"><p>';
      html += row.nom;
      html += '</p></div>';
      console.log(row);
    });
    html += '<div class="project new_project"><p>';
    html += 'New Project </br>+';
    html += '</p></div></a>';

    document.querySelector('.projects').innerHTML = html;
  });

  function connect(callback){
      var mysql = require('mysql');

      // Add the credentials to access your database
      var connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'root',
          password : 'root',
          database : 'chronos',
          socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
      });

      // connect to mysql
      connection.connect(function(err) {
          // in case of error
          if(err){
              console.log(err.code);
              console.log(err.fatal);
          }
      });

      // Perform a query
      $query = 'SELECT `id`,`nom` FROM `projects`';

      connection.query($query, function(err, rows, fields) {
          if(err){
              console.log("An error ocurred performing the query.");
              console.log(err);
              return;
          }

          callback(rows);

          console.log("Query succesfully executed");
      });

      // Close the connection
      connection.end(function(){
          // The connection has been closed
      });
  }
};
