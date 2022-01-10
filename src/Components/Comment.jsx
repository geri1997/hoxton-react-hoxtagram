import React from 'react'
import '../../styles/comment.css'

const Comment = ({comment}) => {
    return (
        <li>{comment.content}</li>
    )
}

export default Comment
