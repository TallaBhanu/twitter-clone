import React, {useState, useEffect } from 'react'
import "./Post.css";
import {db} from './firebase';
import Avatar from "@material-ui/core/Avatar";
import * as firebase from 'firebase';


function Post({postId,user,imageUrl,username,caption}){
    const [comments,setComments]=useState([]);
    const [comment,setComment]=useState('');
    
    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe=db
              .collection("posts")
              .doc(postId)
              .collection("comments")
              .orderBy('timestamp','desc')
              .onSnapshot((snapshot)=>{
                  setComments(snapshot.docs.map((doc)=>doc.data()));
              })
        }

        return ()=>{
            unsubscribe();
        }
    },[postId]);

    const postComment=(event)=>{
        event.preventDefault();
        if(user){
            db.collection("posts").doc(postId).collection("comments").add({
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                text:comment,
                username:user.displayName
            });
            setComment('');
        }
        else{
            alert("Login to add Comment");
        }

       
    }

    return(
       <div className="post">
           <div className="post__header">
           <Avatar
             src="insta.jpeg"
             alt="Bhanu"
             className="post__avatar"
             />
           <h3>{username}</h3>
           </div>
           
            <img
              className="post__image"
              src={imageUrl}
              alt=""
              />

           <h4 className="post__text"><strong className="post__userNameCaption">{username}</strong>{caption}</h4>
           
           <div className="posts__comments">
           {comments.map((comment)=>(
                   <p>
                       <strong>{comment.username}</strong>{comment.text}
                   </p>
            ))}
           </div>
           
           
                <form className="post__commentbox">
                <input
                    className="post__input"
                    placeholder="Add comment..."
                    type="text"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                    />
                   <button
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                   >Post
                    </button> 
               </form>
               
           
       </div>
    )
}

export default Post