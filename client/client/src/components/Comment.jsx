import { FaEdit, FaHeart, FaReply, FaTrash } from 'react-icons/fa'
import IconBtn from "./IconBtn"
import { usePost } from '../context/ContextApi'
import { CommentList } from './CommentList'
import { useState } from 'react'
import CommentForm from './CommentForm'
import { UseAsync, UseAsyncFn } from '../hooks/UseAsync'
import createComment, { deleteComment, updateComment } from '../services/Comments'

const formattedDate = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function Comment({ id, message, createdAt, user }) {
  const {post,getReplies, createLocalComments , editLocalComment, deleteLocalComment,currUserId} =usePost()
  // console.log(post.id)

  const createCommentFn = UseAsyncFn(createComment)
  const onCommentEditFn = UseAsyncFn(updateComment)
  const onCommentDeleteFn = UseAsyncFn(deleteComment)


  const childComments = getReplies(id)
  const [areChildrenHidden,setAreChildrenHidden] = useState(false)
  const [isReplying,setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)


  const createdAtDate = new Date(createdAt)
  const now = new Date()
  const diffInMs = now - createdAtDate
  const isOlderThan15Minutes = diffInMs < 15 * 60 * 1000



  function onCommentReply(message){
    return  createCommentFn.execute({postId:post.id, message, parentId:id}).
    then(comments=>{
     setIsReplying(false)
    createLocalComments(comments)
   }
  )}

  function onCommentEdit(message){
    return onCommentEditFn.execute({postId:post.id, message,id})
    .then(
      comments=>{
        setIsEditing(false)
        console.log(comments)
        editLocalComment(id,comments.message)
      }
    )
  }

  function onCommentDelete(){
    console.log("--->",id,"<-------")

    return onCommentDeleteFn.execute({postId:post.id,id})
    .then(deleteLocalComment(id))
  }
  console.log("currId ==",currUserId)
  const toShow = user.id==currUserId
  const showEditDelete = toShow && isOlderThan15Minutes
  // console.log(showEditDelete)
  return (
   <>
     <div className="comment">
      <div className="header">
        <span className="name">{user.name }{currUserId}</span>
        <span className="date">{formattedDate.format(createdAtDate)}</span>
      </div>
      {/* {console.log(message,"printing message")} */}
      {isEditing? <CommentForm  autoFocus initialValue={message} onSubmit={onCommentEdit}/>:
      <div className="message">{message}</div>
      }
      <div className="footer">
        <IconBtn onClick={()=>setIsReplying(pre=>!pre)} 
          isActive={isReplying}
        Icon={FaReply}  aria-label={isReplying? "Cancel-Reply":"Reply"} />

        {showEditDelete &&(
          <IconBtn Icon={FaEdit} onClick={()=>setIsEditing(pre=>!pre)} isActive={isEditing}  aria-label={isEditing ? "Cancel Edit" : "Edit"}  />
        )}
        
        
        {showEditDelete && (
          <IconBtn disabled={onCommentDeleteFn.loading} onClick={onCommentDelete}  Icon={FaTrash} aria-label="Delete" color="danger"/>
        )}
      </div>
    </div>
    {isReplying &&(
      <div className='mt-1 ml-3'>
        <CommentForm autoFocus onSubmit={onCommentReply} loading={createCommentFn.loading} error={createCommentFn.error} />
      </div>
      
    )}

    {childComments?.length>0 && (
        <>
            <div className={`nested-comments-stack ${areChildrenHidden ? "hide":""} `} onClick={()=>setAreChildrenHidden(false)}>
                <button aria-label='Hide Replies' className='collapse-line'/>
                    <div className='nested-comments'>
                        <CommentList comments={childComments}/>
                    </div>
            </div>
            <button className={`btn mt-1 ${!areChildrenHidden ?"hide":""}`} onClick={()=>setAreChildrenHidden(false)}>
                Show Replies
            </button>
        </>
    )}
   </>
  )
}

export default Comment
