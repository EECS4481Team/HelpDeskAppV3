import axios from "axios";
import {useState,useEffect} from "react";
import {storage} from "../firebase"
import "./upload.css"

// It's okay for these to be public on client-side JS
// You just don't ever want to leak your API Secret
import {ref,uploadBytes,listAll,getDownloadURL} from "firebase/storage";
import {v4} from 'uuid';

function Upload(){
    const [imageUpload,setImageUpload] = useState(null);
    const [imageList,setImageList] = useState([]);

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
        <h1>IMAGE CHAT HAHAHA...</h1>
        <input type="file" onChange={(event) => {setImageUpload(event.target.files[0]);
        }}
        />
        <button onClick={uploadImage}>Upload Image</button>
    
        {imageList.map((url) => {
            return <img src={url}/>
        })}
    </div>
)
}
export default Upload;