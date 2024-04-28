import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { supabase } from "../main";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";

export async function loader( { params } ) {
    let { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', params?.username)

    let { data: posts, error: errorPosts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', profiles[0]?.user_id)
        .order('created_at', { ascending: false });

    return [profiles, posts, params];
}

export default function Profile() {
    const {userData, setUserData} = useContext(UserContext);
    const [profiles, posts, params] = useLoaderData();
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFollow, setIsFollow] = useState(null);
    const [profileFollowingCount, setProfileFollowingCount] = useState(null);
    const [profileFollowersCount, setProfileFollowersCount] = useState(null);
    const [followBox, setFollowBox] = useState(false);
    const [followingData, setFollowingData] = useState(null);
    const [followersData, setFollowersData] = useState(null);

    useEffect(() => {
        setFollowBox(false)
    }, [params])

    const navigate = useNavigate();
    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            let { data: following } = await supabase
                .from('follows')
                .select('*')
                .eq('takipeden_id',  profiles[0]?.user_id)
                setProfileFollowingCount(following && following.length)

            
            let { data: followingProfiles } = await supabase
                .from('profiles')
                .select('*')
                .in('user_id', following.map(x => x.takipedilen_id))
                console.log(followingProfiles)
                setFollowingData(followingProfiles ? followingProfiles : null)


            let { data: followers } = await supabase
                .from('follows')
                .select('*')
                .eq('takipedilen_id',  profiles[0]?.user_id)
                setFollowersData(followers ? followers : null)
                setProfileFollowersCount(followers && followers.length)

            let { data: followerProfiles } = await supabase
                .from('profiles')
                .select('*')
                .in('user_id', followers.map(x => x.takipeden_id))
                setFollowersData(followerProfiles ? followerProfiles : null)
            
            let { data: follows, error } = await supabase
                .from('follows')
                .select('*')
                .eq('takipeden_id', userData?.user_id)
                .eq('takipedilen_id', profiles[0]?.user_id)

            setIsFollow(follows?.length > 0 ? true : false)
            setLoading(false);
        }
        fetchData();
    }, [profiles, userData])

    console.log(isFollow)

    async function handleFollow(e) {
        e.preventDefault();

        if(isFollow === true) {
            
            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('takipeden_id', userData?.user_id,)
                .eq('takipedilen_id', profiles[0]?.user_id)
                setIsFollow(false)
                setProfileFollowersCount(profileFollowersCount - 1)
        } else {

            const { data, error } = await supabase
                .from('follows')
                .insert([
                    {
                        takipeden_id: userData?.user_id,
                        takipedilen_id: profiles[0]?.user_id,
                    }
                ])
                .select()
                setIsFollow(true)
                setProfileFollowersCount(profileFollowersCount + 1)
        }
      
    }

    async function handleEdit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        console.log(formObj)

        const updateData = {};

        if (formObj.name !== '') {
            updateData.name = formObj.name;
        }

        if (formObj.surname !== '') {
            updateData.surname = formObj.surname;
        }

        if (formObj.biography !== '') {
            updateData.biography = formObj.biography;
        }

        if (formObj.social_facebook !== '') {
            updateData.social_facebook = formObj.social_facebook;
        }

        if (formObj.social_twitter !== '') {
            updateData.social_twitter = formObj.social_twitter;
        }

        if (formObj.social_instagram !== '') {
            updateData.social_instagram = formObj.social_instagram;
        }

        if (formObj.social_linkedin !== '') {
            updateData.social_linkedin = formObj.social_linkedin;
        }

        if (formObj.social_github !== '') {
            updateData.social_github = formObj.social_github;
        }

        console.log(updateData)
        
        const { data, error } = await supabase
            .from('profiles')
            .update(
                [updateData]
            )
            .eq('user_id', userData?.user_id)
            .select()

            console.log(error)

            if (!error) {
                navigate(`/profile/${profiles[0].username}`)
                setEditMode(false)
            }
    }


    if (editMode === true || followBox === true) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }

    console.log(followingData)
    return (
        <>
        {editMode === true &&
            <div className="edit-mode">
                <form onSubmit={handleEdit}>
                    <header>
                        <h3>Profil Düzenle</h3>
                        <button onClick={() => setEditMode(false)}><i className="fa-solid fa-xmark"></i></button>
                    </header>
                    <input autoComplete="off" type="text" name="name" placeholder="Yeni ad giriniz." />
                    <input autoComplete="off" type="text" name="surname" placeholder="Yeni soyad giriniz." />
                    <textarea autoComplete="off" name="biography" placeholder="Yeni biyografi giriniz." cols="30" rows="3"></textarea>
                    <input autoComplete="off" type="text" name="social_facebook" placeholder="Facebook kullanıcı adı giriniz." />
                    <input autoComplete="off" type="text" name="social_instagram" placeholder="Instagram kullanıcı adı giriniz." />
                    <input autoComplete="off" type="text" name="social_twitter" placeholder="Twitter kullanıcı adı giriniz." />
                    <input autoComplete="off" type="text" name="social_github" placeholder="Github kullanıcı adı giriniz." />
                    <input autoComplete="off" type="text" name="social_linkedin" placeholder="Linkedin kullanıcı adı giriniz." />
                    <button>Güncelle</button>
                </form>
            </div>
        }
        {followBox === true &&
            <div className="follow-box">
                <div>
                    <header>
                            <button onClick={() => (setFollowBox(false))}><i className="fa-solid fa-xmark"></i></button>
                            <p>Takipçi</p>
                            <p>Takip Edilen</p>
                    </header>
                    <main>

                        <div style={{marginRight: '-1px', borderRight: '1px solid #000'}}>

                            {followersData?.map(x => (
                                <div className="follow-item">
                                    <img src={`https://jqowllhfrssthyxxsnpu.supabase.co/storage/v1/object/public/${x.profile_pic}`} alt="" />
                                    <div>
                                        <Link to={`/profile/${x.username}`}>@{x.username}</Link>
                                        <p>{x.name} {x.surname}</p>
                                    </div>
                                </div>
                            ))}

                        </div>

                        <div>
                            {followingData?.map(x => (
                                <div className="follow-item">
                                    <img src={`https://jqowllhfrssthyxxsnpu.supabase.co/storage/v1/object/public/${x.profile_pic}`} alt="" />
                                    <div>
                                        <Link to={`/profile/${x.username}`}>@{x.username}</Link>
                                        <p>{x.name} {x.surname}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </main>
                </div>
            </div>
        }
        <div className="profile-page">
        {loading === true ?
            <div className="loading-bg">
                <div className="loading"></div>
            </div>
            :
            profiles && (
                <div className="profile">
                    <div className="container">
                        <img src={profiles[0]?.profile_pic ? `https://jqowllhfrssthyxxsnpu.supabase.co/storage/v1/object/public/${profiles[0]?.profile_pic}` : '../img/user.jpg'} alt="" />
                        <div>
                            <h5>@{profiles[0]?.username}</h5>
                            <h3>{profiles[0]?.name} {profiles[0]?.surname}</h3>
                            <p>{profiles[0]?.biography ? profiles[0]?.biography : 'Biyografi bulunmuyor'}</p>
                            <div>
                                <p onClick={() => (setFollowBox(true))}>Takipçi:<span>{profileFollowersCount}</span></p>
                                <p onClick={() => (setFollowBox(true))}>Takip edilen:<span>{profileFollowingCount}</span></p>
                            </div>
                            
                            {userData?.username === profiles[0]?.username ?
                                <button onClick={() => (setEditMode(true))}>Düzenle</button>
                                :
                                userData && (
                                    <>
                                        {isFollow === true ?
                                            <button onClick={handleFollow}>Takip ediliyor</button>
                                            :
                                            <button onClick={handleFollow}>Takip et</button>
                                        }
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            )
        }

        <div className="profile-posts">
            <div className="container">
                {posts && posts.map(x => (
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
        </div>


        </div>
        </>
    )
}