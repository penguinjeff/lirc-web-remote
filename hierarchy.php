<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>json2html appendChild Example</title>
    <!-- https://github.com/moappi/json2html -->
    <script src="js/json2html.js"></script>
    <script src="js/json2dom.js"></script>
    <script src="js/hierarchy.js?ts=<?php echo time();?>"></script>
</head>
<body>

<script>
let data = {
    base1: ["option1.1", "option1.2"],
    base2: ["option2.1", "option2.2"]
};

function leaf(list_of_select_box_objects,list_of_selected_options)
{
        console.log(list_of_select_box_objects);
        console.log(list_of_select_box_objects[0].name);
        console.log(list_of_selected_options);
}


const ui1 = hierarchySelector(data,leaf,{
name: "ui1",
//debug: true,
});

const ui2 = hierarchySelector(data,leaf,{
name: "ui2",
//debug: true,
showBasePlaceholder: false,
});

// ⭐ Add this line here
//console.log(ui1.outerHTML);
//console.log(ui2.outerHTML);

document.body.appendChild(ui1);
document.body.appendChild(ui2);
</script>

</body>
</html>
