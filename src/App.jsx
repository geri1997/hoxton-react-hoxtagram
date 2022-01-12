import React, { useEffect, useState } from "react";
import Logo from "./Components/Logo";
import Image from "./Components/Image";

import "../styles/App.css";

function App() {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState("");

  function addNewPost(title, url) {
    fetch("http://localhost:3000/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        likes: 0,
        image: url,
        userName: user.username,
      }),
    })
      .then((resp) => resp.json())
      .then((post) => {
        post.comments = [];
        let newImages = [post, ...images];

        setImages(newImages);
      });
  }
  function signIn(e) {
    fetch("http://localhost:3000/users?username=" + e.target.username.value)
      .then((resp) => resp.json())
      .then((user) => {
        if (user[0].password === e.target.passw.value) {
          setUser(user[0]);
          setModal((prevModal) => (prevModal = ""));
        }
      });
  }

  function signUp(user) {
    fetch(`http://localhost:3000/users/?username=${user.username}`)
      .then((resp) => {
        return resp.json();
      })
      .then((serverUser) => {
        console.log(serverUser);
        if (serverUser.length === 0) {
          createNewUserOnServer(user)
            .then((resp) => resp.json())
            .then((user) => setUser((prevUser) => (prevUser = user)));
          setModal((prevModal) => (prevModal = ""));
        }
      });
  }
  function createNewUserOnServer(user) {
    return fetch("http://localhost:3000/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  }

  useEffect(() => {
    fetch("http://localhost:3000/images")
      .then((resp) => resp.json())
      .then((images) =>
        setImages((prevImages) => (prevImages = images.reverse()))
      );
  }, []);

  let imagesToDisplay = [...images];
  function search(e) {
    setSearchTerm(e.target.value);
  }
  if (searchTerm) {
    imagesToDisplay = imagesToDisplay.filter((image) =>
      image.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <React.Fragment>
      {modal && (
        <section className="modal-wrapper">
          <div className="modal">
            <h2>{modal === "login" ? "Sign in" : "Sign up"}</h2>
            <form
              style={{ display: "grid" }}
              onSubmit={(e) => {
                e.preventDefault();
                if (modal === "login") {
                  signIn(e);
                } else {
                  signUp({
                    username: e.target.username.value,
                    password: e.target.passw.value,
                    likedImages: [],
                  });
                }
              }}
            >
              <label htmlFor="username">Username</label>
              <input required type="text" name="username" id="username" />
              <label htmlFor="username">Password</label>
              <input required type="password" name="passw" id="passw" />
              <button className="ok-button">Submit</button>
            </form>
            <button
              onClick={(e) => setModal((prevModal) => (prevModal = ""))}
              className="close-modal-btn"
            >
              X
            </button>
          </div>
        </section>
      )}
      <Logo />

      <section className="image-container">
        <div className="user-btns">
          {!user && (
            <>
              <button
                onClick={(e) => {
                  setModal("login");
                }}
              >
                Sign In
              </button>
              <button
                onClick={(e) => {
                  setModal("sign up");
                }}
              >
                Sign Up
              </button>
            </>
          )}
          {user && (
            <button
              onClick={(e) => {
                setUser((prevUser) => (prevUser = null));
              }}
            >
              Sign out
            </button>
          )}
        </div>
        <label htmlFor="search">Search:</label>
        <input type="text" name="search" id="search" onChange={search} />
        {user && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addNewPost(e.target.title.value, e.target.url.value);
              e.target.reset();
            }}
          >
            <h5>Post new image</h5>
            <span>Title:</span>
            <input type="text" required name="title" />
            <br />
            <span>Image url:</span>
            <input name="url" type="text" required />
            <button hidden></button>
          </form>
        )}

        {imagesToDisplay.map((image) => (
          <Image
            setUser={setUser}
            user={user}
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
