import React,{useState,useEffect} from 'react';
import Post from "./Post";
import  ReactDom from 'react-dom';
import './App.css';
import {db,auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button,Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import axios from './axios.js';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes=useStyles();
  const [modalStyle]=useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const [open,setOpen]=useState(false);
  const [openSignIn,setOpenSignIn]=useState('');
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [email,setEmail]=useState('');
  const [user,setUser]=useState(null);

  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        console.log(authUser);
        setUser(authUser);
      }
      else{
          setUser(null);
      }
    })

    return ()=>{
      unsubscribe();
    }
  },[user,username]);

  useEffect(() =>{
    const fetchPosts = async() =>
     await axios.get('/sync').then(response=>{
      console.log(response);
      setPosts(response.data)
    });
    fetchPosts();
  },[]);
  
  const signUp = (e) => {
    e.preventDefault();
   
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message));
    setOpen(false);
  }

  const signIn =(event)=>{
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email,password)
      .catch((error)=>alert(error.message))

    setOpenSignIn(false);  
  }
   
  return (
    <div className="App">
     
         
         
      
      <Modal
            open={open}
            onClose={()=>setOpen(false)}
            >
        <div style={modalStyle} className={classes.paper}>
          <form id="app__signup">
            <center>
            <img
            className="app__headerImage"
            src="https://fontlot.com/wp-content/uploads/2020/03/Twitter-Logo-Font.jpg"
            alt="Instagram"
            />
            </center>
            <Input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            />
            <Input
            placeholder="e-mail"
            type="text"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <Button onClick={signUp} type="submit">Sign Up</Button>
            
          </form>
           
        </div>
      </Modal>

      <Modal
            open={openSignIn}
            onClose={()=>setOpenSignIn(false)}
            >
        <div style={modalStyle} className={classes.paper}>
          <form id="app__signup">
            <center>
            <img
            className="app__headerImage"
            src="https://fontlot.com/wp-content/uploads/2020/03/Twitter-Logo-Font.jpg"
            alt="Instagram"
            />
            </center>
            <Input
            placeholder="e-mail"
            type="text"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <Button onClick={signIn} type="submit">Sign In</Button>
            
          </form>
           
        </div>
      </Modal>
      <div className="app__header">
      <img
           className="app__headerImage"
           src="https://fontlot.com/wp-content/uploads/2020/03/Twitter-Logo-Font.jpg"
           alt="Instagram"
        />
        {user?(
        <Button onClick={()=>auth.signOut()}>Log Out</Button>
      ):(
        <div className="app__loginContainer">
           <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
           <Button onClick={()=>setOpen(true)}>Sign Up</Button>
        </div>
      )}
      </div>
      <div className="app__posts">
        <div className="app_postsleft">
        {
        posts.map((post) =>(
          <Post 
          user={user}
          key={post._id}
          postId={post._id} 
          username={post.user}
          caption={post.caption}
          imageUrl={post.image}   />
        ))
      }
      
        </div>
        <div className="app__postsright">
          <div className="post__uploader">
          <h3 className="post__adder"><strong>Add Your Posts</strong></h3>
          <div className="posts_imageuploader">
          <ImageUpload user={user} /> 
          </div>
          </div>
         
          
        </div>
      
      </div>
       
         
        
      </div>
  );
}

export default App;
