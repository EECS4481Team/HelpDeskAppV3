import React,{useState,useEffect} from "react";
import styled from "styled-components";
import { useNavigate} from "react-router-dom";
import loader from "../assets/loader.png";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import * as Buffer from 'Buffer';
export default function SetAvatar() {
    //Will probably use in the future, need this page so app will run
    const api = "https://api.multiavatar.com/45678945";
    const navigate = useNavigate();
    const [avatars,setAvatars] = useState([]);
    const [isLoading,setIsLoading] = useState([true]);
    const [selectedAvatars,setSelectedAvatars] = useState(undefined);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover:true,
        draggable: true,
        theme: "dark",
        };
    const setProfilePicture = async () => {
        if(selectedAvatars === undefined){
            toast.error("Please select an avatar",toastOptions);
        } else{
            const user = await JSON.parse(localStorage.getItem("eecs4481-project"));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`,{image: avatars[selectedAvatars]});
        }
        
    };
    useEffect(() => {
        getImages();
    },[]);
    const getImages = async () =>{
        const data =[];
        for(let i=0; i<4; i++){
            const image = await axios.get(`${api}/${Math.round(Math.random() * 1000 )}`
            );
            const buffer = new Buffer(image.data);
            data.push(buffer.toString("base64"));
        }
        setAvatars(data);
        setIsLoading(false);

    };
    return(
    <>
    {
        isLoading ? <Container>
            <img src={loader} alt="loader" className="loader" />

        </Container>: (

        
        <Container>
            <div className="title-container">
                <h1>
                    Pick an avatar as your profile pictures
                </h1>
            </div>
            <div className="avatars">{
                avatars.map((avatar,index)=>{
                        return (
                            <div key = {index} className={`avatar ${selectedAvatars === index ? "selected":""}`}>
                                <img src={`data:image/svg+xml;base64,${avatar}`} alt = "avatar"
                                onClick={()=> setSelectedAvatars(index)}
                                />
                            </div>
                        
                        )
                    })
                }</div>
                <button className="submit-btn" onClick={setProfilePicture}>Set as Profile Picture</button>
            </Container>
            )}
            
        <ToastContainer />
    </>
    );
}

const Container = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;
    .loader{
        max-inline-size: 100%;
    }
    .title-container{
        h1{
            color: white;
        }
    }
    .avatars{
        display: flex;
        gap: 2rem;
        .avatar{
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5.rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
        }
        img{
            height: 6rem;
        }
        .selected{
            border: 0.4 rem solid #4e0eff;
        }
    }
   
    .submit-btn{
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
`;

