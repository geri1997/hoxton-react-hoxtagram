import React, { useState } from "react";
import Comment from "./Comment";
import "../../styles/image.css";

const Image = ({ image, images, setImages }) => {
  const [buttonClicked, setButtonClicked] = useState(false);

  function addNewComment(e, image, images) {
    fetch("http://localhost:3000/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageId: image.id,
        content: e.target.newComment.value,
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

    e.target.classList.add("liked");
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
    e.target.classList.remove("liked");
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
        <button
          onClick={(e) => {
            deleteImage(image);
          }}
        >
          Delete Image
        </button>
        <h2 className="title">{image.title}</h2>
        <img src={image.image} className="image" />
        <div className="likes-section">
          <span className="likes">{image.likes}</span>
          <button
            onClick={(e) => {
              buttonClicked
                ? decreaseLikes(image.id, e)
                : increaseLikes(image.id, e);
              setButtonClicked(!buttonClicked);
            }}
            className="like-button"
          >
            ♥
          </button>
        </div>
        <ul className="comments">
          {image.comments.map((comment) => (
            <Comment
              images={images}
              image={image}
              setImages={setImages}
              comment={comment}
              key={comment.id}
            />
          ))}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewComment(e, image, images);

            e.target.reset();
          }}
        >
          <input type="text" name="newComment" />
        </form>
      </article>
    </>
  );
};

export default Image;
