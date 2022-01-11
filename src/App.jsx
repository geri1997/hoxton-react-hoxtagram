import React, { useEffect, useState } from "react";
import Logo from "./Components/Logo";
import Image from "./Components/Image";

import "../styles/App.css";

function App() {
  const [images, setImages] = useState([]);
  function addNewPost(title, url) {
    fetch("http://localhost:3000/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        likes:0,
        image:url
      }),
    })
      .then((resp) => resp.json())
      .then((post) => {
        post.comments=[]
        let newImages = [...images,post]
       
        setImages(newImages);
      });
  }

  useEffect(() => {
    fetch("http://localhost:3000/images")
      .then((resp) => resp.json())
      .then((images) => setImages(images));
  }, []);

  return (
    <React.Fragment>
      <Logo />

      <section className="image-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewPost(e.target.title.value, e.target.url.value);
            e.target.reset();
          }}
        >
          <span>Title:</span>
          <input type="text" required name="title" />
          <br />
          <span>Image url:</span>
          <input name="url" type="text" required />
          <button hidden></button>
        </form>
        
        {images.map((image) => (
          <Image
            key={image.id}
            image={image}
            images={images}
            setImages={setImages}
          />
        ))}
      </section>
    </React.Fragment>
  );
}

export default App;
