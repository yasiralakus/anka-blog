import { useContext, useEffect, useState } from "react"
import { supabase } from "../main"
import { UserContext } from "../App";
import { Link } from "react-router-dom";

export default function Following() {

    const {userData} = useContext(UserContext)

    const [postsData, setPostsData] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            let { data: follows, error } = await supabase
                .from('follows')
                .select('takipedilen_id')
                .eq('takipeden_id', userData?.user_id)

            if(!error) {
                let { data: posts } = await supabase
                .from('posts')
                .select('*')
                .in('user_id', follows.map(x => x.takipedilen_id))
                .order('created_at', { ascending: false });
                setPostsData(posts.length > 0 ? posts : null)
            }
            setLoading(false)
        }

        fetchData();
    }, [])

    return (
        <div className="following-page">


        {loading === true ? 
            <div className="loading-bg">
                <div className="loading"></div>
            </div>
            :
            postsData === null ? <div className="container">
                <p>{userData ? 'Takip ettiğiniz bir kullanıcı bulunmuyor veya takip ettiğiniz kullanıcıya ait gönderi bulunmuyor.' : 'Kullanıcı girişi yapmalısınız.'}</p>
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