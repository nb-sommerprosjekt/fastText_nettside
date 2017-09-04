function getClassificationLink() {
  var url =  document.getElementById('URL_from_user').value;
  var server_url = "http://tensor-1.nb.no:5000/rest_link/";
  var xhttp = new XMLHttpRequest();
  var result=xhttp.open("POST", server_url, false);
  xhttp.setRequestHeader("Content-type","application/json");
  console.log(url);
  var PDFbool =  document.getElementById('PDFbox').checked;
  xhttp.send(JSON.stringify([url,PDFbool]));
  result = xhttp.responseText;
  console.log(PDFbool);
  result=JSON.parse(result);  
  console.log(result);
  console.log(typeof result);

  if (result=="Noe gikk galt"){
    var listContainer = document.getElementById("results");
    var header = document.createElement("h2")
    header.setAttribute("id", "failureH2");

    var paragraph= document.createTextNode("Noe gikk galt under klassifiseringen. Det kan være noe galt med linken som du sendte inn. Pass på. Om du er sikker på at du har fulgt kravene over, kan det være noe feil med serveren. Vennligst ta kontakt med 'sommervikarene' om problemet vedvarer.");
    header.appendChild(paragraph);
    listContainer.insertBefore(header, listContainer.childNodes[0]);
  }
  else{
    populateList(url,result,"results");
  }
}

function populateList(url,result,id_name){
  var listContainer = document.getElementById(id_name);

  var newList = document.createElement("ul");
  newList.setAttribute("id", "resultUL");


  for(var i = 0 ; i < result.length ; i ++)
  {

    var newListItem = document.createElement("li");
    var probability=parseFloat(result[i][1]);
    if (0<=probability && probability<0.05){
      continue;
    }
    var probability_text =getProbabilityText(probability)

    newListItem.innerHTML = "Dewey-nr: <b>"+result[i][0] + "</b> er "+probability_text + "  Klassebetegnelsen er \'"+result[i][2]+"\'.";

    newList.appendChild(newListItem);

  }
  if (newList.childElementCount !=0){
    listContainer.insertBefore(newList, listContainer.childNodes[0]);
  }
  else{
    var feilmelding=document.createTextNode("Beklager, men det var ingen dewey-nr som er spesielt sannsynlige.")
    listContainer.insertBefore(feilmelding, listContainer.childNodes[0]);
  }

  var header = document.createElement("h2")
  var paragraph= document.createTextNode("Her er resultatet fra: "+url)
  header.appendChild(paragraph);
  listContainer.insertBefore(header, listContainer.childNodes[0]);
}

function getProbabilityText(probability){
  var probability_text =""

  if (0.05<=probability && probability<0.25){
    probability_text="svært lite sannsynlig"
  }
  else if (0.25<=probability && probability<0.50){
    probability_text="litt sannsynlig"
  }
  else if (0.50<=probability && probability<0.75){
    probability_text="ganske sannsynlig"
  }
  else if (0.75<=probability && probability<=1.0){
    probability_text="svært Sannsynlig"
  }
  return probability_text

}
