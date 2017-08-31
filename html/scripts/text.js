function populateList(url,result,id_name){
              var listContainer = document.getElementById(id_name);
              var header = document.createElement("h2")
              var paragraph= document.createTextNode("Her er resultatet fra: ");
              header.appendChild(paragraph);
              listContainer.appendChild(header);
              var newList = document.createElement("ul");


              for(var i = 0 ; i < result.length ; i ++)
                  {

                      var newListItem = document.createElement("li");
                      var probability=parseFloat(result[i][1])*100;
                      newListItem.innerHTML = "Label: <b>"+result[i][0] + "</b>  Sannsynlighet: <b>"+probability+"%</b>";

                      newList.appendChild(newListItem);

                  }

              listContainer.appendChild(newList);

}

function getClassificationText(){

    var text =  document.getElementById('text_from_user').value;
    var server_url = "http://tensor-1.nb.no:5000/rest_text/";
    var xhttp = new XMLHttpRequest();
    var result=xhttp.open("POST", server_url, false);
    xhttp.setRequestHeader("Content-type","application/json");
    console.log(text);
    xhttp.send(JSON.stringify(text));
    result = xhttp.responseText;
    console.log(result);
    result=JSON.parse(result);
    console.log(result);
    console.log(typeof result);

    populateList(text,result,"results");
}