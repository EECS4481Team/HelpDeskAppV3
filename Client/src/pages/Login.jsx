import React,{useState,useEffect} from "react";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import Logo from "../assets/logo.png";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";
function Login(){
    const navigate = useNavigate();
    const [values,setValues]=useState({
        username: "",
        password: "",
    });

    const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover:true,
    draggable: true,
    theme: "dark",
    }
    //submit to check login against the backend database
    const handleSubmit = async (event)=>{
        event.preventDefault();
        if(handleValidation()){
                console.log("in validation",loginRoute);
            const {password,username} = values;
            const {data} = await axios.post(loginRoute,{
                username,
                password,
            }).catch(function (error){
                if(error.response){
                    toast.error("Login Failed!", toastOptions);
                }
            });
            if(data.status === undefined){
                console.log(data);
                localStorage.setItem(`HelpDeskAppV1`, JSON.stringify(data));
                navigate("/chat");
            }
           
            
        }
    };
    //Checks if inputs are ok
    const handleValidation =() => {
        const {password,username} = values;
        if(password === ""){
            console.log("inm validation",toast);
            toast.error("Username and password is required",toastOptions);
            return false;
        }else if (username.length === ""){
            toast.error("Username and password is required",toastOptions);
            return false;
        }
        return true;
    }
    //to change inputs
    const handleChange = (event) =>{
        setValues({...values,[event.target.name]:event.target.value});
    };
    return (
        //renders the page
    <>
        <FormContainer>
            <form onSubmit={(event)=>handleSubmit(event)}>
                <div className="brand">
                    <img src={Logo} alt="Logo" />
                    <h1>Sneaky Admin</h1>
                </div>
                <input type="text" placeholder="Username" name="username" onChange={(e)=> handleChange(e)}/>
                <input type="password" placeholder="Password" name="password" onChange={(e)=> handleChange(e)}/>
                <button type="submit">Log In</button>
                <span>  
                    Don't have an account ? <Link to="/register">Register</Link>
                    </span>
                    <span>  
                    Are you an Anonymous User ? <Link to="/globalchat">Join Chat</Link>
                    </span>
            </form>
        </FormContainer>
        <ToastContainer />
    </>
    );
}

const FormContainer = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap : 1rem;
align-items: center;
background-color: #b3e3c0;
.brand{
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img{
        height: 9rem;
    }
    h1{
        color: white;
        font-size: 2.5em;
    }
}
form{
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #56b870;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input{
        background-color: white;
        padding: 1rem;
        border: 0.1rem solid #707b8c;
        border-radius: 0.4rem;
        color: black;
        width: 100%;
        font-size: 1rem;
        &:focus{
            border: 0.1rem solid #707b8c;
            outline: none;
        }
    }
    button{
        background-color: #254f30;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.5s ease-in-out;
        &:hover{
            background-color: #158a34;
        }
    }
    span {
        color: white;
        text-transform: uppercase;
        text-align: center;
        a {
            color: #37523e;
            text-transform: none;
            font-weight: bold;
            
        }
    }
}
`;

export default Login;