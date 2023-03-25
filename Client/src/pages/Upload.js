import axios from "axios";
import {useState,useEffect} from "react";
import {storage} from "../firebase"
import "./upload.css"
import { useNavigate } from "react-router-dom";

// It's okay for these to be public on client-side JS
// You just don't ever want to leak your API Secret
import {ref,uploadBytes,listAll,getDownloadURL} from "firebase/storage";
import {v4} from 'uuid';

function Upload(){
    const [imageUpload,setImageUpload] = useState(null);
    const [imageList,setImageList] = useState([]);
    const navigate = useNavigate();

    const imageListRef = ref(storage, "images/")
    const uploadImage = () => {
        if(imageUpload == null) return;
        const imageRef = ref(storage,`images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef,imageUpload).then((snapshot)=> {
            getDownloadURL(snapshot.ref).then((url)=>{
                setImageList((prev)=>[...prev,url])
            });
        });
        
    };

    const moveHome = () => {
        navigate("/")
      }
      
useEffect(()=>{
    listAll(imageListRef).then((response)=>{
        response.items.forEach((item)=>{
            getDownloadURL(item).then((url)=>{
                setImageList((prev)=>[...prev,url]);
            })
        })
    })
},[])

return (
    <div className="App">
        <h1>WELCOME TO IMAGE CHAT HAHAHA... (In Progress)</h1>
        <div id="space">
        <input id="filePick" type="file" onChange={(event) => {setImageUpload(event.target.files[0]);
        }}
        />
        </div>
        <div id="space">
        <button id="fileUp" onClick={uploadImage}>Upload Image</button>
        </div>
        <div id="space" className="redirect">
        <button onClick={moveHome}>Click to return to home</button>
        </div>
        {imageList.map((url) => {
            return <div class="container"> <img src={url}/> <div class="bottom">{url}</div> </div>
        })}
    </div>
)
}
export default Upload;