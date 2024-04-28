import { Link } from "react-router-dom";
import { supabase } from "../main";
import { useEffect, useState } from "react";

export default function Home() {

    const [loading, setLoading] = useState(false);
    const [postsData, setPostsData] = useState(null)
    
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            let { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if(error) {
                console.log(error)
            } else {
                setPostsData(posts)
            }

            setLoading(false)
        }

        fetchData();
    }, [])

    return (
        <div className="home-page">
            {loading === true ? (
                <div className="loading-bg">
                    <div className="loading"></div> 
                </div>
            ) : (
                <div className="container">
                    {postsData && postsData.map(x => (
                        <div className="post-item" key={x.post_id}>
                            <div>
                                <img src={`https://jqowllhfrssthyxxsnpu.supabase.co/storage/v1/object/public/${x.post_photo}`} alt="" />
                                <Link to={`/category/${x.category}`}>{x.category}</Link>
                            </div>
                            <h6>{`${x.created_at.slice(8,10)}.${x.created_at.slice(5,7)}.${x.created_at.slice(0,4)}`} - <Link to={`/profile/${x.username}`}>@{x.username}</Link></h6>
                            <h1>{x.title}</h1>
                            <Link to={`/${x.username}/post/${x.post_id}`}>DEVAMINI OKU! <i className="fa-solid fa-chevron-right"></i></Link>
                        </div>
                    ))}
                </div>
            )}
            
        </div>
    )
}