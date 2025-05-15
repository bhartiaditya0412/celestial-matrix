import React from 'react'
import { usePost } from '../context/ContextApi'
import { CommentList } from './CommentList'
import CommentForm from './CommentForm'
import { UseAsync, UseAsyncFn } from '../hooks/UseAsync'
import createComment from '../services/Comments'

function Posts() {
  const {loading, error, execute:createCommentFn }= UseAsyncFn(createComment)
  const {post,rootComments, createLocalComments}= usePost()
  const onCommentCreate =(message)=>{
    console.log("MESSAGE => ", message)
   return  createCommentFn({
      postId:post.id, message
    })
    .then(createLocalComments).then(console.log("createLocalComments=>",message))
  }
  console.log("posts  -=> ", post)
  return (
    <>
    <h1>
      {post.title}
    </h1>
    <article>
      {post.body}
    </article>
    <h3 className='comments-title'>
    Comments
    </h3>
    <section>
      <CommentForm loading={loading} error={error} onSubmit={onCommentCreate} />
      {rootComments!=null && rootComments.length>0 && (
        <div className='mt-4'> 
        <CommentList comments ={rootComments}/>
        </div>
      )}
    </section>


    </>
  )
}

export default Posts