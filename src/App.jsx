import { useState, useEffect, createContext } from "react";
import { Link, NavLink, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { supabase } from "./main";
import CategoriesSlide from "./Pages/CategoriesSlide";

export async function loader() {
    const { data: { user } } = await supabase.auth.getUser();

    let { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id);

    return [user, profiles];
}

export const UserContext = createContext(null);

export default function App() {
    const [inputValue, setInputValue] = useState('')
    const [user, profiles] = useLoaderData();
    const [userData, setUserData] = useState(profiles ? profiles[0] : null)
    const [users, setUsers] = useState(null)
    const navigate = useNavigate();
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(null)

    useEffect(() => {
        async function fetchData() {
                let { data: profiles, error } = await supabase
                    .from('profiles')
                    .select('username');
                if(!error) {
                    setUsers(profiles)
                }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scroll = window.scrollY;
            setScrollPosition(scroll)
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    function handleSearchUser(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        const sonuc = []
        users?.map(x => (x.username === formObj.user && sonuc.push('evet')))
        if(sonuc[0] === 'evet') {
            navigate(`/profile/${formObj.user}`)
        } else {
            alert('KULLANICI BULUNAMADI!')
        }
        setInputValue('')

    }

    function searchInputFunction(e) {
        setInputValue(e.target.value)
    }

    async function handleLogout(e) {
        e.preventDefault();
        let { error } = await supabase.auth.signOut()
        setUserData(null)
    }

    

    return (
        <div className="full-page">

            <a style={scrollPosition > 200 ? {opacity: '1'} : {}} className="go-to-top" href="#top"><i className="fa-solid fa-arrow-up"></i></a>

            <header id="top" className="header">
                    <div className="hero">
                        <h1>ANKA BLOG</h1>
                        <p>Be the change you want to see in the world.</p>
                        <h3>Toplam Kullanıcı: {users?.length}</h3>
                    </div>

                <div className="container">
                    <div className="nav">

                        <ul>
                            <li><NavLink to={'/'}><i className="fa-solid fa-house"></i> Anasayfa</NavLink></li>
                            <li><NavLink to={'/following'}><i className="fa-solid fa-user"></i> Takip ettiklerim</NavLink></li>
                            <li><NavLink to={'/saves'}><i className="fa-solid fa-bookmark"></i> Kaydedilenler</NavLink></li>
                            <li><NavLink to={'/new-post'}><i className="fa-solid fa-pen-to-square"></i> Yeni Gönderi</NavLink></li>
                            <li>
                                <form onSubmit={handleSearchUser}>
                                    <button><i className="fa-solid fa-magnifying-glass"></i></button>
                                    <input style={inputValue !== '' ? {width: '250px', paddingLeft: '16px'} : {}} autoComplete="off" onChange={searchInputFunction} value={inputValue} type="text" name="user" placeholder="Kullanıcı Ara..." />
                                </form>
                            </li>
                        </ul>

                        <div onClick={() => {openMobileMenu === true ? setOpenMobileMenu(false) : setOpenMobileMenu(true)}} className="hamburger-menu">

                            <span style={openMobileMenu === true ? {transform: 'rotate(45deg) translateX(9px) translateY(5px)'} : {}}></span>
                            <span style={openMobileMenu === true ? {opacity: '0'} : {}}></span>
                            <span style={openMobileMenu === true ? {transform: 'rotate(135deg) translateX(-8px) translateY(5px)'} : {}}></span>

                        </div>

                        <div>
                            {userData !== null ?
                            <>
                                <button onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i> Çıkış</button>
                                <NavLink to={`/profile/${userData?.username}`}><i className="fa-solid fa-user"></i> Profil</NavLink>
                            </>
                            : 
                            <NavLink to="/login-signup"><i className="fa-solid fa-user"></i> Giriş Yap / Kayıt Ol</NavLink>}
                        </div>

                    </div>

                    {openMobileMenu === true && 
                    <ul className="mobile-nav">

                        <li><NavLink to={'/'}><i className="fa-solid fa-house"></i> Anasayfa</NavLink></li>
                        <li><NavLink to={'/following'}><i className="fa-solid fa-user"></i> Takip ettiklerim</NavLink></li>
                        <li><NavLink to={'/saves'}><i className="fa-solid fa-bookmark"></i> Kaydedilenler</NavLink></li>
                        <li><NavLink to={'/new-post'}><i className="fa-solid fa-pen-to-square"></i> Yeni Gönderi</NavLink></li>

                    </ul>}
                </div>
            </header>

            <div className="categories">
                <div className="container">
                    <CategoriesSlide />
                </div>
            </div>

            <div className="outlet-page">
                <UserContext.Provider value={{userData, setUserData}}>
                    <Outlet />
                </UserContext.Provider>
            </div>

            <footer className="footer">

                <div className="container">

                    <p>ankablog 2024 © Tüm hakları saklıdır.</p>

                    <p>coded by <Link to={'https://www.yasiralakus.com.tr'}>yasiralakus</Link></p>

                    <div>
                        <Link><i className="fa-brands fa-facebook"></i></Link>
                        <Link><i className="fa-brands fa-twitter"></i></Link>
                        <Link><i className="fa-brands fa-instagram"></i></Link>
                        <Link><i className="fa-brands fa-linkedin"></i></Link>
                        <Link><i className="fa-brands fa-github"></i></Link>
                        <Link><i className="fa-solid fa-envelope"></i></Link>
                    </div>

                </div>

            </footer>

        </div>
    )
}