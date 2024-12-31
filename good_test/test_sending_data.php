<?php
function sanatize($input)
{
 return preg_replace('/[^A-Za-z0-9_.\-\{\}\[\]\"\'\:]/', '', $input);
}
if(isset($_REQUEST['data']))
{
 header('Content-Type: application/json');
 echo json_encode(json_decode(sanatize(file_get_contents("php://input"))));
}
else
{
?>
<html>
 <head>
  <script>
var test={"user":"John"};
function send()
{
 alert(JSON.stringify(test));
 var request = new Request('test.php?data=yes',
  { 
    method: 'POST',
    mode: "same-origin",
    credentials: "same-origin",
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(test)
  }
 );
 fetch(request)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text();
  })
  .then(data => {
    // console.log(data); // Log the JSON response
    // Process the data
    alert(data);
  })
  .catch(error => {
    // console.error("Fetch error:", error);
  });
}
  </script>
 </head>
 <body>
<INPUT type="button" value="press" onclick="send()">

 </body>
</html>
<?php
}
?>
