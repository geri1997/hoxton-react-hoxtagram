import React, { useEffect, useState } from "react";
import Logo from "./Components/Logo";
import Image from "./Components/Image";

import '../styles/App.css'

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/images")
      .then((resp) => resp.json())
      .then((images) => setImages(images));
  }, []);

  return (
    <React.Fragment>
      <Logo />

      <section className="image-container">
        {images.map((image) => (
          <Image key={image.id} image={image}/>
        ))}
      </section>
    </React.Fragment>
  );
}

export default App;
