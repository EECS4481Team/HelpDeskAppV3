import React,{useState,useEffect} from "react";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import Logo from "../assets/logo.png";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";
function Register(){
    const navigate = useNavigate();
    const [values,setValues]=useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover:true,
    draggable: true,
    theme: "dark",
    }
    //submit to check registration against the backend database
    const handleSubmit = async (event)=>{
        event.preventDefault();
        if(handleValidation()){
                console.log("in validation",registerRoute);
            const {password,userName,email} = values;
            const {data} = await axios.post(registerRoute,{
                userName,
                email,
                password,
            });
            if(data.status === undefined){

                localStorage.setItem(`HelpDeskAppV1Reg`, JSON.stringify(data.user));

                navigate("/login");
            }
            
        }
    };
    //Checks if inputs are ok
    const handleValidation =() => {
        const {password,confirmPassword,userName,email} = values;
        if(password !== confirmPassword){
            console.log("inm validation",toast);
            toast.error("password and confrim password should be same",toastOptions);
            return false;
        }else if (userName.length <3){
            toast.error("Username should be greater than 3 characters",toastOptions);
            return false;
        }else if (password.length <8){
            toast.error("Password should be equal or greater than 8 characters",toastOptions);
            return false;
        }else if (email === ""){
            toast.error("email is required",toastOptions);
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
                    <h1>Admin Register</h1>
                </div>
                <input type="text" placeholder="Username" name="userName" onChange={(e)=> handleChange(e)}/>
                <input type="email" placeholder="Email" name="email" onChange={(e)=> handleChange(e)}/>
                <input type="password" placeholder="Password" name="password" onChange={(e)=> handleChange(e)}/>
                <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={(e)=> handleChange(e)}/>
                <button type="submit">Create User</button>
                <span>  
                    Already have an account ? <Link to="/login">Login</Link>
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

export default Register;