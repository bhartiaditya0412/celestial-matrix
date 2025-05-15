import React, { useMemo, useContext, useState, useEffect } from "react";
import { UseAsync } from "../hooks/UseAsync";
import { useParams } from "react-router-dom";
import { getPost } from "../services/posts";
import Cookies from "js-cookie";
const Context = React.createContext();

export function usePost() {
  return useContext(Context);
}

const PostProvider = ({ children }) => {
    const currUserId = Cookies.get("userId");
    console.log("currentUserId--> ",currUserId)
    // const params = useParams();
    // console.log("params-->",params)

  const { id } = useParams()
  const [comments, setComments] = useState([]);
  const { loading, error, value: post } = UseAsync(() => getPost(id), [id]);
  

  const commentsByParentId = useMemo(() => {
    const group = {};
    comments.forEach(comment => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);

  useEffect(() => {
      if (!post || !Array.isArray(post.Comment)) return;
      setComments(post.Comment);
    }, [post?.Comment]);
    

    function getReplies(parentId) {
      return commentsByParentId[parentId] || [];
    }

  function createLocalComments(comment) {
      setComments(prev => [ comment,...prev]);
  }

  function editLocalComment(id, message){
    setComments(prev=>{
        return prev.map((comment)=>{
            if(comment.id===id){
                return  {...comment, message}
            }
            else{
                return comment
            }
        })
    })
  }

  function deleteLocalComment(id){
    setComments(prev=>{
        return prev.filter(comment=>comment.id!==id)
    }
  )}
  return (
    <Context.Provider value={{
      post: post ? { id, ...post } : null,
      rootComments: commentsByParentId[null] || [],
      getReplies,
      createLocalComments,
      editLocalComment,
      deleteLocalComment,
      currUserId:currUserId

    }}>
      {loading ? <h1>Loading</h1> :
        error ? <h1 className="error-message">{error}</h1> :
        children}
    </Context.Provider>
  );
};

export { PostProvider };
