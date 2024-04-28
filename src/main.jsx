import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { loader as loaderApp } from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Following from './Pages/Following.jsx'
import Saves from './Pages/Saves.jsx'
import NewPost from './Pages/NewPost.jsx'
import Post, { loader as loaderPost } from './Pages/Post.jsx'
import Profile, { loader as loaderProfile } from './Pages/Profile.jsx'
import { createClient } from '@supabase/supabase-js'
import Authentication from './Pages/Authentication.jsx'
import Category, { loader as loaderCategory } from './Pages/Category.jsx'

export const supabase = createClient('https://jqowllhfrssthyxxsnpu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxb3dsbGhmcnNzdGh5eHhzbnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc2NTMyMDUsImV4cCI6MjAyMzIyOTIwNX0.3g96zm8Xh2pvKpcjoNt171ZtrCXIPF5WjIOxO5N808k')

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        loader: loaderApp,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/following',
                element: <Following />
            },
            {
                path: '/saves',
                element: <Saves />
            },
            {
                path: '/login-signup',
                element: <Authentication />
            },
            {
                path: '/:username/post/:post_id',
                element: <Post />,
                loader: loaderPost
            },
            {
                path: '/new-post',
                element: <NewPost />
            },
            {
                path:'/profile/:username',
                element: <Profile />,
                loader: loaderProfile
            },
            {
                path: '/category/:category',
                element: <Category />,
                loader: loaderCategory
            }

        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
