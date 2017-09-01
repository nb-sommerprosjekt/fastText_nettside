function populateList(url,result,id_name){
              var listContainer = document.getElementById(id_name);

              var newList = document.createElement("ul");
              newList.setAttribute("id", "resultUL");


              for(var i = 0 ; i < result.length ; i ++)
                  {

                      var newListItem = document.createElement("li");
                      var probability=parseFloat(result[i][1])*100;
                      newListItem.innerHTML = "Label: <b>"+result[i][0] + "</b>  Sannsynlighet: <b>"+probability+"%</b>";

                      newList.appendChild(newListItem);

                  }

              listContainer.insertBefore(newList, listContainer.childNodes[0]);
              var header = document.createElement("h2")
              var paragraph= document.createTextNode("Her er resultatet fra: "+url)
              header.appendChild(paragraph);
              listContainer.insertBefore(header, listContainer.childNodes[0]);
}


function getClassificationLink() {

            var url = document.getElementById("URL_from_user").value;
            var url_encoded = encodeURI(url);
            var server_url = "http://tensor-1.nb.no:5000/rest_doc/"
            full_path_to_response = server_url.concat(url_encoded);

            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", full_path_to_response, false);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();

            var result=xhttp.responseText;
            result=JSON.parse(result);
            if (result=="Noe gikk galt"){
              var listContainer = document.getElementById("results");
              var header = document.createElement("h2")
              var paragraph= document.createTextNode("Noe gikk galt under klassifiseringen. Det kan være noe galt med linken som du sendte inn. Pass på. Om denne meldingen kommer når du prøver å klassifisere andre ting, kan det være noe feil med serveren. Vennligst ta kontakt med 'sommervikarene' om problemet vedvarer.");
              header.appendChild(paragraph);
              listContainer.appendChild(header);
            }
            else{
              populateList(url,result,"results");
            }
}
