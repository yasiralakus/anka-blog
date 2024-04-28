import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { supabase } from "../main";
import { Link, useLoaderData } from "react-router-dom";

export async function loader( {params} ) {
    return params;
}

export default function Category() {

    const {userData} = useContext(UserContext)

    const [postsData, setPostsData] = useState(null);
    const [loading, setLoading] = useState(false)
    const params = useLoaderData();
    console.log(postsData)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            
            let { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .eq('category', params?.category)
            setPostsData(posts.length > 0 ? posts : null)
            setLoading(false)
        }

        fetchData();
    }, [params])

    return (
        <div className="category-page">

            {loading === true ? 
            <div className="loading-bg">
                <div className="loading"></div>
            </div>
            :
            postsData === null ?
            <div className="container">
                <p>Bu kategoride bir gönderi bulunamadı.</p>
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