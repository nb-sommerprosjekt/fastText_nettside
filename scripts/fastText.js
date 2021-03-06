var rest_adress="http:////0.0.0.0:5000"; //"http:////158.39.103.39:5000"
var rest_adress_freddyw="http:////nbr-freddyw.nb.no:5000";

function getClassificationLink() {
  var url =  document.getElementById('URL_from_user').value;
  var server_url = rest_adress+"/rest_link/";
  var xhttp = new XMLHttpRequest();
  var result=xhttp.open("POST", server_url, false);
  xhttp.setRequestHeader("Content-type","application/json");
  console.log(url);
  var model = getValueRadioButton(document.getElementsByName("machinelearning"));
  console.log(model)
  var PDFbool =  document.getElementById('PDFbox').checked;
  var DOIbool =  document.getElementById('DOIbox').checked;
  xhttp.send(JSON.stringify([url,model,PDFbool,DOIbool]));
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
  else if (result=="DOI") {
    postErrorMessage("doi");
  }
  else{ 
    populateList(url,result,article_id,"results","link");
  }
}
//tensor-1.nb.no
function getClassificationText(){

  var text =  document.getElementById('text_from_user').value;
  var server_url = rest_adress+ "/rest_text/";
  console.log(server_url)
  var xhttp = new XMLHttpRequest();
  var result=xhttp.open("POST", server_url, false);
  xhttp.setRequestHeader("Content-type","application/json");
  console.log(text);
  var model = getValueRadioButton(document.getElementsByName("machinelearning"));
  console.log(model)
  xhttp.send(JSON.stringify([text,model]));
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

function getSummarization(){

  var text =  document.getElementById('text_from_user').value;
  var server_url = rest_adress_freddyw + "/rest_summarize/";
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
    postErrorMessage("summarize");
  }
  else{
    populateList(text,result,article_id,"results","summarize");
  }
}

function sendFeedback(feedback,parentElement){
  resultList=parentElement.parentElement
  feedback=feedback.split(",")
  if (feedback[0]=="Send"){
    console.log
    feedback[0]= resultList.getElementsByTagName('input')[0].value;
  }
  console.log(parentElement.parentElement)
  var server_url = rest_adress+"/rest_feedback/";
  var xhttp = new XMLHttpRequest();
  var result=xhttp.open("POST", server_url, false);
  xhttp.setRequestHeader("Content-type","application/json");
  xhttp.send(JSON.stringify(feedback));
  
  result = xhttp.responseText;
  console.log("Feedback sendt");
  var button_index=feedback[2]
  
  if (button_index==-1){
    resultList.removeChild(resultList.lastChild);
    resultList.appendChild(document.createElement("br"))
    resultList.appendChild(document.createTextNode("Takk for tilbakemeldingen!"))
  }
  else{

    resultList.removeChild(resultList.childNodes[(button_index*2)+1]);
    resultList.insertBefore(document.createTextNode("Takk for tilbakemeldingen!"),resultList.childNodes[(button_index*2)+1])
  }
  
}



function populateList(url,result,article_id,id_name,method){
  var listContainer = document.getElementById(id_name);

  var newList = document.createElement("ul");
  newList.setAttribute("id", "resultUL");
  if (method=="summarize"){
    var newListItem = document.createElement("li");
    newListItem.innerHTML = result;
    newList.appendChild(newListItem);
    console.log("xummarizing")
    var feedbackButtons= createFeedbackButtonsSummarize(article_id,-1);  
    newList.appendChild(feedbackButtons)
    listContainer.insertBefore(newList, listContainer.childNodes[0]);
    
  }
  else{

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
      var feedbackButtons= createFeedbackButtons(article_id,i);  
      newList.appendChild(feedbackButtons)

    }
    if (newList.childElementCount !=0){

      var newElement=document.createElement("ul");
      newElement.appendChild(document.createTextNode("Riktig Dewey-nr:"))
      var input = document.createElement('input'); 
      input.type = "text";   
      newElement.appendChild(input); 
      newElement.appendChild(createButton("Send",article_id,-1))
      newList.appendChild(newElement)   


      listContainer.insertBefore(newList, listContainer.childNodes[0]);

    }
    else{
      var feilmelding=document.createTextNode("Beklager, men det var ingen dewey-nr som er spesielt sannsynlige.")
      listContainer.insertBefore(feilmelding, listContainer.childNodes[0]);
    }

  }
  var header = document.createElement("h2")
  if (method=="link"){
    var paragraph= document.createTextNode("Her er resultatet fra: "+url)
  }
  else if (method=="text"){
    var paragraph= document.createTextNode("Her er resultatet fra klassifiseringen: ")
  }
  else {
    var paragraph= document.createTextNode("Her er resultatet: ")
    
  }
  header.appendChild(paragraph);
  listContainer.insertBefore(header, listContainer.childNodes[0]);


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
  else if(method=="summarize"){
    var paragraph= document.createTextNode("Noe gikk galt under genereringen av sammendraget. Pass på at du  sender inn en lang norsk tekst.");
  }
  else if(method=="doi"){
    var paragraph= document.createTextNode("Noe gikk galt under omgjøring fra DOI. Prøv å bruke en vanlig URL istedenfor, eller prøv fulltekst istedenfor");
  }
  else{
    var paragraph= document.createTextNode("Noe gikk galt under klassifiseringen.");
  }
  header.appendChild(paragraph);
  listContainer.insertBefore(header, listContainer.childNodes[0]);
}


function createFeedbackButtons(article_id,id){
  var newList = document.createElement("ul");
  newList.setAttribute("id","createFeedbackButtons");
  newList.appendChild(createButton("Riktig",article_id,id));
  newList.appendChild(createButton("Delvis",article_id,id));
  newList.appendChild(createButton("Helt galt",article_id,id));
  return newList;
}

function createFeedbackButtonsSummarize(article_id,id){
  var newList = document.createElement("ul");
  newList.setAttribute("id","createFeedbackButtons");
  newList.appendChild(createButton("Nyttig",article_id,id));
  newList.appendChild(createButton("Delvis Nyttig",article_id,id));
  newList.appendChild(createButton("Unyttig eller uforståelig",article_id,id));
  return newList;
}

function createButton(feedback,article_id,id){
  var button =document.createElement("button");
  button.value = [feedback , article_id , id];
  button.onclick = function(){sendFeedback(button.value,button.parentElement);}
  var t = document.createTextNode(feedback);
  button.appendChild(t);

  return button;

}
function createTextboxButton(article){

}



function getValueRadioButton(element){
  var machinelearning = "default"
  for(var i = 0; i < element.length; i++){
      if(element[i].checked){
          machinelearning = element[i].value;
      }
  }
  return machinelearning
}