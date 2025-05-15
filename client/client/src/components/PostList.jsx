import React from 'react'
import { useState,useEffect } from 'react'
import getPosts from '../services/posts'
import { Link } from 'react-router-dom'
import { UseAsync } from '../hooks/UseAsync'
function PostList() {
const {loading ,error, value:posts}= UseAsync(getPosts) 
console.log(posts," HERE ") 
  if(loading)return <h1>LOADING</h1>
  if(error)return <h1 className='error-message'>{error}</h1>
  return (
    <div>{posts.map((post , index)=>{
        return(
            <h1 key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h1>
        )
    })}
    </div>
  )
}

export default PostList