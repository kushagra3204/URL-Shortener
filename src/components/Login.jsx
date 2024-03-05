import "../App.css";
import google from "../assets/google.png";
import microsoft from "../assets/microsoft.png";
import facebook from "../assets/facebook.png";
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import MicrosoftLogin from "react-microsoft-login";
import { useState } from "react";

const Login = () => {

    const [emailID,setEmailID] = useState("");
    const [password,setPassword] = useState("");
    const [LoginSuccessful,setLoginInfo] = useState(false);

    function handleEmailLogin(event) {
        event.preventDefault();
        let UserLogin = {
            email: emailID,
            password: password
        };
        fetch("/api/verify/user",{
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(UserLogin)
        }).then(res => res.json()).then(data => {
            //output
            let {successful} = data;
            setLoginInfo(successful);
            if(successful === true){
                alert("Login Successful");
            }
            else {
                alert("Login Unsuccessful");
            }
        }).catch(error => {
            console.log('Error: ',error);
        });
    }

    const loginGoogle = useGoogleLogin({
        onSuccess: (takenResponse) => console.log(takenResponse),
    });
    
    const authHandler = (err, data) => {
        console.log(err, data);
    };

    

    return (
        <div style={{overflow: "hidden"}}>
            <div class="navbar">
                <div className="movLeft">
                    <a href="/" className="aStyle"><h2>URL Shortener</h2></a>
                </div>
            </div>
            <div className="LoginPage">
                <div className="ThirdParty">
                    <h1 style={{marginRight: "80px",marginBottom: "40px", fontWeight: "1000"}}>Login to Your Account</h1>
                    
                    <div className="SignupThirdParty" onClick={() => loginGoogle()}>
                        <img src={google} alt="Google logo" className="SignupLogo" />
                        <p className="signupP">Continue with Google</p>
                    </div>

                    <MicrosoftLogin 
                        clientId="7141f252-460a-4283-96e7-a5a843467f14" 
                        authCallback={authHandler} 
                    >
                        <div className="SignupThirdParty">
                            <img src={microsoft} alt="Microsoft logo" className="SignupLogo" />
                            <p className="signupP">Continue with Microsoft</p>
                        </div>
                    </MicrosoftLogin>

                    <FacebookLogin
                        appId="763786292263480"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={(response) => { console.log(response);}}
                        render={renderProps => (
                            <div className="SignupThirdParty" onClick={renderProps.onClick}>
                                <img src={facebook} alt="Facebook logo" className="SignupLogo" />
                                <p className="signupP">Continue with Facebook</p>
                            </div>
                        )}
                    />

                    <div className="SignupGridOR" >
                        <hr className="gridItemOR" style={{width: "100%"}} />
                        <p className="gridItemOR" >OR</p>
                        <hr className="gridItemOR" style={{width: "100%"}} />
                    </div>
                </div>

                <div className="logincontainer">
                    <h2 style={{padding: "20px",letterSpacing: "1px"}} >Login with Email-ID</h2>
                    <form className="formLogin">
                        <div className="divRow">
                            <label className="labelLogin">Email</label>
                            <input type="email" placeholder="Enter Email-ID" className="inputLogin" onChange={(e) => setEmailID(e.target.value)} value={emailID} required />
                        </div>
                        <div className="divRow">
                            <label className="labelLogin">Password</label>
                            <input type="password" placeholder="Enter Password" className="inputLogin" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        </div>
                        <div className="divRow">
                            <button className="btnLogin" onClick={handleEmailLogin}>Login</button>
                        </div>
                    </form>
                    <hr style={{margin: "10px 20px"}} />
                    <p style={{fontFamily: "Saphira", fontSize: "16px",padding: "10px 20px",letterSpacing: "1px"}}>New member?, <a href="/signup" style={{textDecoration: "none"}}>Sign Up</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;