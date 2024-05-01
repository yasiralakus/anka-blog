import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { supabase } from "../main";
import { Link } from "react-router-dom";

export default function Saves() {

    const {userData} = useContext(UserContext)

    const [postsData, setPostsData] = useState(null);
    const [loading, setLoading] = useState(false)
    console.log(postsData)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            let { data: saves, error } = await supabase
                .from('saves')
                .select('post_id')
                .eq('user_id', userData?.user_id)

            if(!error) {
                let { data: posts } = await supabase
                .from('posts')
                .select('*')
                .in('post_id', saves && saves.map(x => x.post_id))
                .order('created_at', { ascending: false });
                setPostsData(posts.length > 0 ? posts : null)
            }
            
            setLoading(false)
        }

        fetchData();
    }, [])

    return (
        <div className="saves-page">

            {loading === true ? 
            <div className="loading-bg">
                <div className="loading"></div>
            </div>
            :
            postsData === null ?
            <div className="container">
                <p>{userData ? 'Kaydedilmiş bir gönderi bulunmuyor.' : 'Kullanıcı girişi yapmalısınız.'}</p>
            </div> :
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
            }

        </div>
    )
}