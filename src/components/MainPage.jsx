import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import "../App.css";
import urlelement from "../assets/urlelement.svg";
import Notification from "./Notification";
import copy from 'clipboard-copy';

const MainPage = () => {
    
    const [URL,setURL] = useState("");
    const [shortURL,setShortURL] = useState("");
    const [customurl,setcustomurl] = useState("");
    const [customurlclick,setcustomurlclick] = useState(false);

    function handleURL(event){
        event.preventDefault();
        if(isValidUrl(URL))
        {
            if(customurl==="") {
                let urlJSON = {
                    ogURL:URL
                };
                fetch("/api/url",{
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(urlJSON)
                }).then(res => res.json()).then(data => {
                    let {sURL} = data;
                    setShortURL("localhost:5000/"+sURL);
                }).catch(error => {
                    console.error('Error:', error);
                });
                console.log("Hello, Did you clicked?? "+URL);
            }
            else {
                let urlJSON = {
                    ogURL:URL,
                    customURL:customurl 
                };
                fetch("/api/customurl",{
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(urlJSON)
                }).then(res => res.json()).then(data => {
                    console.log(data);
                    let {successful} = data;
                    if(successful===true)
                    {
                        setShortURL("localhost:5000/"+customurl);
                        console.log("Hello, Did you clicked?? "+URL);
                    }
                    else {
                        alert("Following url is already been used, select another url.");
                    }
                }).catch(error => {
                    console.error('Error:', error);
                });
            }
        }
        else {
            alert("Invalid URL");
        }
    }

    const isValidUrl = urlString=> {
        var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
        '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
        return !!urlPattern.test(urlString);
    }

    function customurlbtn() {
        setcustomurlclick(!customurlclick);
    }

    const [isCopied, setIsCopied] = useState(false);
    
    const handleCopyClick = async () => {
        try {
        await copy(shortURL);
        setIsCopied(true);
        } catch (error) {
        console.error('Failed to copy text:', error);
        }
    };
    
    const hideNotification = () => {
        setIsCopied(false);
    };
    
    return (
        <div style={{overflow: "hidden"}}>
            <div class="navbar">
                <div className="movLeft">
                    <a href="/" className="aStyle"><h2>URL Shortener</h2></a>
                </div>
                <div className="movRight">
                    <a href="/login" className="aStyle">Login</a>
                    <a href="/signup" className="aStyle">Sign Up</a>
                </div>
            </div>
            <div className="add-bg-col">
                <div className="add-bg-row">
                    <div className="Box1">
                        <form onSubmit={handleURL} className="form">
                            <div className="URLTextBox">
                                <FontAwesomeIcon icon={faLink} style={{marginRight: "7px"}}/>
                                <p>Enter your long URL here</p>
                            </div>
                            
                            <input type="text" onChange={(e) => setURL(e.target.value)} style={{marginLeft: 0, marginBottom: "20px"}} value={URL} placeholder="https://example.com/" required />
                            <div className="CenterDiv">
                                <div className={`customurltextbox ${customurlclick ? 'active' : ''}`}>
                                    <input type="button" value="Custom URL" className="customurl" onClick={customurlbtn} />
                                    {customurlclick ? ( <input type="text" placeholder="Enter Custom URL" className="customurlinput" value={customurl} onChange={(e) => setcustomurl(e.target.value)} /> ) : null}
                                </div>
                                <input type="submit" value="Get URL" className="button50"/>
                            </div>
                        </form>
                        <div className="shortURLDiv">
                            <span className="shortURLDiv1">Shorten URL</span>
                            <span onClick={handleCopyClick} className="shortURLDiv2">{shortURL}</span>
                        </div>
                    </div>
                    <img src={urlelement} alt="" className="urlelements"/>
                    <Notification message="Text copied to clipboard!" isVisible={isCopied} onHide={hideNotification} />
                </div>
            </div>
        </div>
    );
};  
export default MainPage