import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PostList from './components/PostList'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import { PostProvider } from './context/ContextApi'
import Posts from './components/Posts'
import AuthForm from './components/AuthForm'
function App() {
  
  return (
    <div className="container">
    <Routes>

      <Route path='/posts' element={<PostList/>}/>
      <Route path='/posts/:id' element={
        <PostProvider>
          <Posts/>
        </PostProvider>
      }/>

      <Route path='/' element={<AuthForm />}/>
      

    </Routes>
    </div>
    )
}

export default App
