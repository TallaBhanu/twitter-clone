import React,{useState} from 'react';
import { Button } from '@material-ui/core';
import {storage,db} from './firebase';
import * as firebase from 'firebase';
import './ImageUpload.css';
import axios from './axios.js';


function ImageUpload({user}){
    const [image,setImage] = useState(null);
    const [progress,setProgress] =useState(0);
    const [caption,setCaption]=useState('');
    const [url,setUrl]=useState("");
    
    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }

    };

   
    const handleUpload=()=>{
        if(user){
            
        const uploadTask=storage.ref(`images/${image.image}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress= Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress);
            }
            ,
            (error)=>{
                console.log(error);
                alert(error.message);
            },
            ()=>{
                storage
                  .ref("images")
                  .child(image.name)
                  .getDownloadURL()
                  .then(url=>{
                      setUrl(url);
                      axios.post('/upload',{
                           caption:caption,
                           user:user.username,
                           image:url
                      });



                    db.collection("posts").add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                       caption:caption,
                        imageUrl:url,
                        username:user.displayName
                    });
                    setProgress(0)
                    setCaption("")
                    setImage(null)
                });
                    
            }
        )

        }
        else{
            alert("SignIn to Post");
        }
    }

    return(
        <div className="ImageUpload">
            <input className="caption__bar" type="text" placeholder="Enter a Caption....." onChange={event=>setCaption(event.target.value)}/>
            <input type="file" onChange={handleChange}/>
            <progress className="ImageUpload__progress" value={progress} max="100" />
            <div className="upload_button">
            <Button onClick={handleUpload}>upload</Button>
             </div>
            
        </div>   
    )
}

export default ImageUpload