function generateList(url,result,id_name){
              var listContainer = document.getElementById(id_name);
              var header = document.createElement("h2")
              var paragraph= document.createTextNode("Her er resultatet fra: "+url);
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

function UserAction() {

            var url = document.getElementById("URL_from_user").value;
            var url_encoded = encodeURI(url);
            var server_url = "http://0.0.0.0:5000/rest_doc/"
            full_path_to_response = server_url.concat(url_encoded);
            var xhttp = new XMLHttpRequest();
            result=xhttp.open("GET", full_path_to_response, false);
            xhttp.setRequestHeader("Content-type", "application/json");
            //xhttp.send();
            xhttp.send();
            result=xhttp.responseText;
            result=JSON.parse(result);
            console.log(typeof result);
            //window.open(full_path_to_response.toString());
            //document.getElementById("results").innerHTML=result
            generateList(url,result,"results");
}

