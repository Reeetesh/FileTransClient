import { useState } from "react";
// import avatar from './assets/profile.png'
import "./App.css";

import axios from "axios";

const url = "https://filetrans.onrender.com/files";

function App() {
  const [postImage, setPostImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const createPost = async (obj) => {
    try {
      await axios.post(url, obj);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ fileName: fileName, myFile: postImage });
    console.log("Uploaded");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    console.log(base64);
    const fileN = await idGenerator();
    console.log(fileN);
    setPostImage(...postImage, base64);
    setFileName(...fileName, fileN);
  };
  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(`https://filetrans.onrender.com/api/${fileName}`)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="custom-file-upload"></label>

        <input
          type="file"
          lable="Image"
          name="myFile"
          id="file-upload"
          onChange={(e) => handleFileUpload(e)}
        />
        <button type="submit">Submit</button>
      </form>
      {fileName && <><input type="text" value={`https://filetrans.onrender.com/api/${fileName}`} readOnly />
      {/* Bind our handler function to the onClick button property */}
      <button onClick={handleCopyClick}>
        <span>{isCopied ? 'Copied!' : 'Copy'}</span>
      </button>
      </>
}
      {/* <button onClick={getUser}>Download</button> */}
    </div>
  );
}

export default App;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

function idGenerator() {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return `${dateString}+${randomness}`;
}
