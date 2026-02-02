function load()
{
 remotes=refresh_item('remotes');
 displays=refresh_item('displays');
 activites=refresh_item('activities');
 macros=refresh_item('macros');
 modules=refresh_item('modules');
}

function download(filename, data, mimeType = 'text/plain') {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the object URL
}

function item_save(item)
{
 var text='function get_'+item+'(){return '+JSON.stringify(window[item])+';}';
 // console.log(text);
 download('get_'+item+'.js',text);
}

function save()
{
 item_save('remotes');
 item_save('displays');
 item_save('activities');
 item_save('macros');
 item_save('modules');
}

function refresh_item(tag)
{
 // console.log(tag+':');
 var item=document.getElementById(tag);
 if(item){item.remove};

 document.head.appendChild(createElement({'tag':'script','src':'data/get_'+tag+'.js?ts'+Date.now()}));
 var items=window['get_'+tag]();
 // console.log(items);
 return items;
}

window.addEventListener('load', function () {
 load();
})
