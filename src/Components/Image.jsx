import React from "react";
import Comment from "./Comment";

const Image = ({image}) => {
  return (
    <>
      <article  className="image-card">
        <h2 className="title">{image.title}</h2>
        <img src={image.image} className="image" />
        <div className="likes-section">
          <span className="likes">{image.likes}</span>
          <button className="like-button">♥</button>
        </div>
        <ul className="comments">
          {image.comments.map((comment) => (
            <Comment comment={comment} key={comment.id}/>
          ))}
        </ul>
      </article>
    </>
  );
};

export default Image;
