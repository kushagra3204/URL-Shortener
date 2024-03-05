import "../App.css";
import google from "../assets/google.png";
import facebook from "../assets/facebook.png";
import microsoft from "../assets/microsoft.png";
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import MicrosoftLogin from "react-microsoft-login";
import { useState } from "react";

const Signup = () => {

    const [fname,setFname] = useState("");
    const [lname,setLname] = useState("");
    const [email,setEmail] = useState("");
    const [pass,setPass] = useState("");
    const [repass,setRepass] = useState(""); 

    function handleUserDetails(event) {
        event.preventDefault();
        if(pass === repass) {
            let UserDetail = {
                fname: fname,
                lname: lname,
                email: email,
                pass: pass
            };
            fetch('/api/add/user',{
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(UserDetail)
            }).then(res => res.json()).then(data => {
                let {successful} = data;
                if(successful === true) {
                    alert("User added Successfully");
                }
                else {
                    alert("User not added");
                }
            }).catch(error => {
                console.log("Error: ",error);
            });
        } else {
            alert("Password Does not matches");
        }
    };

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
                    <h1 style={{marginRight: "80px",marginBottom: "40px", fontWeight: "1000"}}>Create Your Account</h1>
                    
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
                    <h2 style={{padding: "20px",letterSpacing: "1px"}} >Sign Up with Email-ID</h2>
                    <form className="formLogin">
                        <div className="divRow">
                            <label className="labelLogin">First Name</label>
                            <input type="text" style={{marginLeft: "0"}} placeholder="Enter First Name" required className="inputLogin" onChange={(e) => setFname(e.target.value)} value={fname} />
                        </div>
                        <div className="divRow">
                            <label className="labelLogin">Last Name</label>
                            <input type="text" style={{marginLeft: "0"}} placeholder="Enter Last Name" required className="inputLogin" onChange={(e) => setLname(e.target.value)} value={lname} />
                        </div>
                        <div className="divRow">
                            <label className="labelLogin">Email</label>
                            <input type="email" placeholder="Enter Email-ID" required className="inputLogin" onChange={(e) => setEmail(e.target.value)} value={email} />
                        </div><br/>
                        <div className="divRow">
                            <label className="labelLogin">Password</label>
                            <input type="password" placeholder="Enter Password" required className="inputLogin" onChange={(e) => setPass(e.target.value)} value={pass} />
                        </div>
                        <div className="divRow">
                            <label className="labelLogin">Re-enter Password</label>
                            <input type="password" placeholder="Enter Password Again" required className="inputLogin" onChange={(e) => setRepass(e.target.value)} value={repass} />
                        </div>
                        <div className="divRow">
                            <button onClick={handleUserDetails} className="btnLogin">Register</button>
                        </div>
                    </form>
                    <hr style={{margin: "10px 20px 10px 20px"}} />
                    <p style={{fontFamily: "Saphira", fontSize: "16px",padding: "10px 20px",letterSpacing: "1px"}}>Already a member, <a href="/login" style={{textDecoration: "none"}}>Log In</a></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;