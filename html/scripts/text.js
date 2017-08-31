function populateList(url,result,id_name){
              var listContainer = document.getElementById(id_name);
              var header = document.createElement("h2")
              var paragraph= document.createTextNode("Her er resultatet fra klassifiseringen: ");
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
    if (result=="Noe gikk galt"){
      var listContainer = document.getElementById("results");
      var header = document.createElement("h2")
      var paragraph= document.createTextNode("Noe gikk galt under klassifiseringen. Teksten må være norsk. Om denne meldingen kommer når du prøver å klassifisere andre ting, kan det være noe feil med serveren. Vennligst ta kontakt med 'sommervikarene' om problemet vedvarer.");
      header.appendChild(paragraph);
      listContainer.appendChild(header);
    }
    else{
      populateList(text,result,"results");
    }

    
}