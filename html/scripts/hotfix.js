function getClassificationLink() {
  var url =  document.getElementById('URL_from_user').value;
  var server_url = "http:////tensor-1.nb.no:5000/rest_link/";
  var xhttp = new XMLHttpRequest();
  var result=xhttp.open("POST", server_url, false);
  xhttp.setRequestHeader("Content-type","application/json");
  console.log(url);
  var PDFbool =  document.getElementById('PDFbox').checked;
  xhttp.send(JSON.stringify([url,PDFbool]));
  result = xhttp.responseText;
  console.log(PDFbool);
  result=JSON.parse(result);
  article_id=result[1]
  result=result[0]
  console.log(result);
  console.log(typeof result);

  if (result=="Noe gikk galt"){
    postErrorMessage("link");
  }
  else{
    populateList(url,result,article_id,"results","link");
  }
}
//tensor-1.nb.no
function getClassificationText(){

  var text =  document.getElementById('text_from_user').value;
  var server_url = "http:////tensor-1.nb.no:5000/rest_text/";
  var xhttp = new XMLHttpRequest();
  var result=xhttp.open("POST", server_url, false);
  xhttp.setRequestHeader("Content-type","application/json");
  console.log(text);
  xhttp.send(JSON.stringify(text));
  result = xhttp.responseText;
  console.log(result);
  result=JSON.parse(result);
  article_id=result[1]
  result=result[0]
  console.log(result);
  console.log(typeof result);
  if (result=="Noe gikk galt"){
    postErrorMessage("text");
  }
  else{
    populateList(text,result,article_id,"results","text");
  }
}

function sendFeedback(feedback){
  console.log(feedback);
  var server_url = "http:////tensor-1.nb.no:5000/rest_feedback/";
  var xhttp = new XMLHttpRequest();
  var result=xhttp.open("POST", server_url, false);
  xhttp.setRequestHeader("Content-type","application/json");
  xhttp.send(JSON.stringify(feedback));
  result = xhttp.responseText;
  console.log("Feedback sent" );
  var resultList=document.getElementById("results");
  resultList=resultList.childNodes[1]
  console.log(resultList.childNodes)
  resultList.removeChild(resultList.childNodes[resultList.childNodes.length-1]);
  resultList.appendChild(document.createTextNode("Takk for tilbakemeldingen!"))
}



function populateList(url,result,article_id,id_name,method){
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

    newListItem.innerHTML = "Dewey-nr: <b>"+result[i][0] + "</b> er "+probability_text + ".  Klassebetegnelsen er \'"+result[i][2]+"\'.";

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
  if (method=="link"){
    var paragraph= document.createTextNode("Her er resultatet fra: "+url)
  }
  else{
    var paragraph= document.createTextNode("Her er resultatet fra klassifiseringen: ")
  }
  header.appendChild(paragraph);
  listContainer.insertBefore(header, listContainer.childNodes[0]);
  var feedbackButtons= createFeedbackButtons(article_id)  
  newList.appendChild(feedbackButtons)

}

function getProbabilityText(probability){
  var probability_text =""

  if (0.05<=probability && probability<0.25){
    probability_text="mindre sannsynlig"
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
function postErrorMessage(method){
  var listContainer = document.getElementById("results");
  var header = document.createElement("h2")
  header.setAttribute("id", "failureH2");
  if (method=="link"){
    var paragraph= document.createTextNode("Noe gikk galt under klassifiseringen. Det kan være noe galt med linken som du sendte inn. Pass på. Om du er sikker på at du har fulgt kravene over, kan det være noe feil med serveren. Vennligst ta kontakt med 'sommervikarene' om problemet vedvarer.");
  }
  else if(method=="text"){
    var paragraph= document.createTextNode("Noe gikk galt under klassifiseringen. Teksten må være norsk. Om du er sikker på at du har fulgt kravene over, kan det være noe feil med serveren. Vennligst ta kontakt med 'sommervikarene' om problemet vedvarer.");
  }
  else{
    var paragraph= document.createTextNode("Noe gikk galt under klassifiseringen.");
  }
  header.appendChild(paragraph);
  listContainer.insertBefore(header, listContainer.childNodes[0]);
}


function createFeedbackButtons(article_id){
  var newList = document.createElement("ul");
  newList.setAttribute("id","createFeedbackButtons");
  newList.appendChild(createButton("God",article_id));
  newList.appendChild(createButton("Middels",article_id));
  newList.appendChild(createButton("Dårlig",article_id));
  return newList;
}

function createButton(feedback,article_id){
  var button =document.createElement("button");
  button.value = [feedback,article_id];
  button.onclick = function(){sendFeedback(button.value);}

  var t = document.createTextNode(feedback);
  button.appendChild(t);

  return button;
}

