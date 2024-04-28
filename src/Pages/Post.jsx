import { useContext, useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { supabase } from "../main";
import { UserContext } from "../App";

export async function loader( {params} ) {
    return [params];
}

export default function Post() {

    const params = useLoaderData();
    const [postData, setPostData] = useState(null)
    const [profileData, setProfileData] = useState(null)
    const {userData} = useContext(UserContext)
    const [commentsData, setCommentsData] = useState(null);
    const [isSave, setIsSave] = useState(null);
    const [isDelete, setIsDelete] = useState(null);
    const [copyLink, setCopyLink] = useState(false);
    const [isLike, setIsLike] = useState(null);
    const [totalLikes, setTotalLike] = useState(null);
    const navigate = useNavigate();

    console.log(commentsData)

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();

            let { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .eq('post_id', params[0]?.post_id)
                setPostData(posts && posts[0])

            let { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', posts[0]?.user_id)
                setProfileData(profiles && profiles[0])

            let { data: saves, error: saveError } = await supabase
                .from('saves')
                .select('*')
                .eq('user_id', userData?.user_id)
                .eq('post_id', posts[0]?.post_id)
                setIsSave(saves?.length > 0 ? true : false)

            let { data: comments, error: commentsError } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', params[0]?.post_id)
                .order('created_at', { ascending: false })
                setCommentsData(comments);

            let { data: totalLikes } = await supabase
                .from('likes')
                .select('*')
                .eq('post_id', posts[0]?.post_id)
                setTotalLike(totalLikes?.length)

            
            let { data: likes, error: errorLikes } = await supabase
                .from('likes')
                .select('*')
                .eq('user_id', user?.id)
                .eq('post_id', posts[0]?.post_id)
                setIsLike(likes?.length > 0 ? true : false)

                // setLoading(false)
        }

        fetchData();
    }, [])

    async function handleAddComment(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        
        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    post_id: postData?.post_id,
                    user_id: userData?.user_id,
                    content: formObj?.content,
                    username: userData?.username,
                    user_profile_pic: userData?.profile_pic
                }
            ])
            .select()

            if(!error) {
                setCommentsData(prev => [...data, ...prev]);
                e.target.reset()
            }
    }

    async function handleLike(e) {
        e.preventDefault();
        
        if(isLike === true) {

            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('user_id', userData?.user_id)
                .eq('post_id', postData?.post_id)
                setIsLike(false)
                setTotalLike(totalLikes - 1)
          
        } else {
            const { data, error } = await supabase
            .from('likes')
            .insert(
                [
                    {
                        post_id: postData?.post_id,
                    }
                ]
            )
            .select()
            setIsLike(true)
            setTotalLike(totalLikes + 1)
        }

    }

    async function handleDelete(e) {
        e.preventDefault();
        
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('post_id', postData?.post_id)

        navigate('/')
    }

    async function handleSave(e) {
        e.preventDefault();
        
        if(isSave === true) {
            const { error } = await supabase
                .from('saves')
                .delete()
                .eq('user_id', userData?.user_id)
                .eq('post_id', postData?.post_id)
                setIsSave(false)

        } else {
            
            const { data, error } = await supabase
                .from('saves')
                .insert([
                    {
                        user_id: userData?.user_id,
                        post_id: postData?.post_id
                    }
                ])
                .select()
                setIsSave(true)
        }

    }

    return (
        <div className="post-page">

            <div className="container">

                <div className="post-details">

                    {postData?.user_id === userData?.user_id && <button onClick={handleDelete}><i className="fa-solid fa-trash"></i></button>}

                    <img src={`https://jqowllhfrssthyxxsnpu.supabase.co/storage/v1/object/public/${postData?.post_photo}`} alt="" />

                    <h1>{postData?.title}</h1>

                    <p>{postData?.content}</p>

                    <div className="post-sharing">

                        <img src={`https://jqowllhfrssthyxxsnpu.supabase.co/storage/v1/object/public/${profileData?.profile_pic}`} alt="" />

                        <div>
                            <h3>{profileData?.name} {profileData?.surname}</h3>
                            <Link to={`/profile/${profileData?.username}`}>@{profileData?.username}</Link>
                            <p>{profileData?.biography}</p>
                            <div>
                                {profileData?.social_facebook !== 'yok' && <Link to={`https://www.facebook.com/${profileData?.social_facebook}`}><i className="fa-brands fa-facebook"></i></Link>}
                                {profileData?.social_instagram !== 'yok' && <Link to={`https://www.instagram.com/${profileData?.social_instagram}`}><i className="fa-brands fa-instagram"></i></Link>}
                                {profileData?.social_twitter !== 'yok' && <Link to={`https://www.twitter.com/${profileData?.social_twitter}`}><i className="fa-brands fa-twitter"></i></Link>}
                                {profileData?.social_linkedin !== 'yok' && <Link to={`https://www.linkedin.com/in/${profileData?.social_linkedin}`}><i className="fa-brands fa-linkedin"></i></Link>}
                                {profileData?.social_github !== 'yok' && <Link to={`https://github.com/${profileData?.social_github}`}><i className="fa-brands fa-github"></i></Link>}
                            </div>
                        </div>

                    </div>

                    <div className="post-interaction">
                        {userData === null ? 'Gönderiyi beğenmek, kaydetmek veya paylaşmak için giriş yapmalısınız.' : 
                        <>
                            {isSave === true ?
                                <button onClick={handleSave}><i className="fa-solid fa-bookmark"></i> Kaydedildi</button>
                                :
                                <button onClick={handleSave}><i className="fa-regular fa-bookmark"></i> Kaydet</button>
                            }
                            <button onClick={handleLike}>{isLike === true ? <i class="fa-solid fa-heart"></i> : <i class="fa-regular fa-heart"></i>} {totalLikes}</button>
                            <button onClick={() => {navigator.clipboard.writeText(window.location.href); setCopyLink(true)}}><i className="fa-solid fa-share-nodes"></i> {copyLink === true ? 'Kopyalandı' : 'Paylaş'}</button>
                            <div><i className="fa-solid fa-tag"></i> <Link to={`/category/${postData?.category}`}>{postData?.category}</Link></div>
                        </>
                        }
                    </div>

                </div>

                <div className="post-comments">

                    <h1>Yorumlar</h1>

                    {userData === null ?
                        <p>Yorumları görüntülemek için giriş yapmalısınız.</p> :
                        commentsData?.length > 0 ? 
                        commentsData.map(x => (
                            <div className="comment-item" key={x.comment_id}>
                                <img src={`https://jqowllhfrssthyxxsnpu.supabase.co/storage/v1/object/public/${x.user_profile_pic}`} alt="" />
                                <div>
                                    <h3><Link to={`/profile/${x.username}`}>@{x.username}</Link> - {x.created_at.slice(8,10)}.{x.created_at.slice(5,7)}.{x.created_at.slice(0,4)}</h3>
                                    <p>{x.content}</p>
                                </div>
                            </div>
                        )) :
                        <p>Henüz yorum yapılmamış.</p>
                    }


                </div>

                <div className="add-comment">
                    <h1>Yorum yap</h1>
                    {userData === null ? 'Yorum yapmak için giriş yapmalısınız.' :
                    
                    <form onSubmit={handleAddComment}>
                        <textarea name="content" cols="30" rows="10" placeholder="Yorumunuz..."></textarea>
                        <button>Yorum Yap</button>
                    </form>}
                </div>

            </div>

        </div>
    )
}