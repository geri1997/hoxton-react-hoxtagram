import React, { useState } from "react";
import Comment from "./Comment";
import "../../styles/image.css";

const Image = ({ image, images, setImages, user, setUser }) => {
  function addNewComment(e, image, images, user) {
    fetch("http://localhost:3000/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageId: image.id,
        content: e.target.newComment.value,
        userName: user.username,  
      }),
    })
      .then((resp) => resp.json())
      .then((comment) => {
        let newImages = images.map((el) => {
          if (el.id === image.id) {
            el.comments.push(comment);
            return el;
          }
          return el;
        });
        setImages(newImages);
      });
  }

  function increaseLikes(id, e) {
    setImages(
      images.map((image) => {
        if (image.id === id) {
          return { ...image, likes: image.likes + 1 };
        }
        return image;
      })
    );
    fetch("http://localhost:3000/images/" + image.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: image.likes + 1,
      }),
    });

    let newUser = JSON.parse(JSON.stringify(user));
    newUser.likedImages.push(id);
    setUser(newUser);

    fetch("http://localhost:3000/users/" + user.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
  }
  function decreaseLikes(id, e) {
    setImages(
      images.map((image) => {
        if (image.id === id) {
          return { ...image, likes: image.likes - 1 };
        }
        return image;
      })
    );
    fetch("http://localhost:3000/images/" + image.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: image.likes - 1,
      }),
    });

    let newUser = JSON.parse(JSON.stringify(user));
    let newLikedImages = newUser.likedImages.filter((imgId) => imgId !== id);
    newUser.likedImages = newLikedImages;
    setUser(newUser);

    fetch("http://localhost:3000/users/" + user.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
  }

  function deleteImage(image) {
    fetch("http://localhost:3000/images/" + image.id, {
      method: "DELETE",
    });

    setImages(
      images.filter((el) => {
        return el.id !== image.id;
      })
    );
  }
  return (
    <>
      <article className="image-card">
        {user?.username === image.userName && (
          <button
            onClick={(e) => {
              deleteImage(image);
            }}
          >
            Delete Image
          </button>
        )}
        <div className="image-info">
          <h2 className="title">{image.title}</h2>
          <h2 className="username">{image.userName}</h2>
        </div>
        <img src={image.image} className="image" />
        <div className="likes-section">
          <span className="likes">{image.likes}</span>
          <button
            onClick={(e) => {
              if (user) {
                user.likedImages.includes(image.id)
                  ? decreaseLikes(image.id, e)
                  : increaseLikes(image.id, e);
              }
            }}
            className={`${
              user?.likedImages?.includes(image.id)
                ? "like-button liked"
                : "like-button"
            }`}
          >
            ♥
          </button>
        </div>
        <ul className="comments">
          {image.comments.map((comment) => (
            <Comment
              user={user}
              images={images}
              image={image}
              setImages={setImages}
              comment={comment}
              key={comment.id}
            />
          ))}
        </ul>
        {user && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addNewComment(e, image, images, user);

              e.target.reset();
            }}
          >
            <input type="text" name="newComment" />
          </form>
        )}
      </article>
    </>
  );
};

export default Image;
