import React from "react";
import "../../styles/comment.css";

const Comment = ({ comment, image, setImages, images, user }) => {
  function deleteComment(comment) {
    let imagesCopy = [...images];
    let index = images.findIndex((el) => image.id === el.id);
    let newComments = imagesCopy[index].comments.filter(
      (el) => comment.id !== el.id
    );
    imagesCopy[index].comments = newComments;
    setImages(imagesCopy);
    fetch("http://localhost:3000/comments/" + comment.id, {
      method: "DELETE",
    });
  }

  return (
    <li>
      <span id="comment-user">{comment.userName}</span>
      {comment.content}{" "}
      {user?.username === comment.userName ? (
        <button
          onClick={() => {
            deleteComment(comment);
          }}
        >
          X
        </button>
      ) : (
        <></>
      )}
    </li>
  );
};

export default Comment;
