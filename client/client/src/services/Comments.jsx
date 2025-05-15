import makeRequest from "./makeRequest";
import React from 'react'

function createComment({postId, message, parentId}) {
  return (
        makeRequest(`/posts/${postId}/comments`, {
            method: 'POST',
            data: {message, parentId},
        }).then(console.log("posted the message",message)).catch(error=>{console.log(error)})

  )
}

function updateComment({postId, message, id}) {
  return (
        makeRequest(`/posts/${postId}/comments/${id}`, {
            method: 'PUT',
            data: {message},
        }).then(console.log("updated the message",message)).catch(error=>{console.log(error)})

  )
}
function deleteComment({postId, id}) {
  return (
        makeRequest(`/posts/${postId}/comments/${id}`, {
            method: 'DELETE',
            
        }).then(console.log("deleted the comment succesfully")).catch(error=>{console.log(error,"ERROR in the deletion")})

  )
}
export {updateComment, deleteComment}
export default createComment