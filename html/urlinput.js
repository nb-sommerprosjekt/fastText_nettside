function UserAction() {

            var url = document.getElementById("URL_from_user").value;
            var url_encoded = encodeURI(url);
            var server_url = "http://127.0.0.1:5000/rest_doc/"
            full_path_to_response = server_url.concat(url_encoded)
            var xhttp = new XMLHttpRequest();
            result=xhttp.open("GET", full_path_to_response, false);
            xhttp.setRequestHeader("Content-type", "application/json");
            //xhttp.send();
            xhttp.send();
            result=xhttp.responseText;
            //window.open(full_path_to_response.toString());
            document.getElementById("results").innerHTML=result
        }
