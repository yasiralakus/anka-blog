import { useContext, useState } from "react";
import { UserContext } from "../App";
import { supabase } from "../main";
import { Link, useNavigate } from "react-router-dom";

export default function NewPost() {

    const {userData} = useContext(UserContext);
    const navigate = useNavigate();
    const [shared, setShared] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    async function handleNewPost(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        setShared(true);

        const { data: addPost, error: errorAddPost } = await supabase
            .from('posts')
            .insert([
                {
                    username: userData?.username,
                    content: formObj.content,
                    title: formObj.title,
                    user_id: userData?.user_id,
                    category: formObj.category
                }
            ])
            .select()
      
        const { data, error } = await supabase
            .storage
            .from('photos')
            .upload(`${userData?.user_id}/post_pics/${userData?.user_id}-${addPost[0]?.post_id}.jpg`, formObj.file);

        const { data: update, error: updateError } = await supabase
            .from('posts')
            .update({ post_photo: data?.fullPath })
            .eq('post_id', addPost[0]?.post_id)
            .select()

            setShared(false);


            if(!updateError) {
                navigate('/')
            }
        
    }

    return (
        <div className="newpost-page">
            <div className="container">
                {userData ?
                <form onSubmit={handleNewPost}>
                    <input type="text" name="title" placeholder="Başlık giriniz."  required/>
                    <select required name="category" id="">
                        <option value="" selected disabled>Kategori Seçiniz</option>
                        <option value="spor">Spor</option>
                        <option value="yemek">Yemek</option>
                        <option value="seyahat">Seyahat</option>
                        <option value="tarih">Tarih</option>
                        <option value="bilim">Bilim</option>
                        <option value="felsefe">Felsefe</option>
                        <option value="siyaset">Siyaset</option>
                        <option value="moda">Moda</option>
                        <option value="sanat">Sanat</option>
                        <option value="aile">Aile</option>
                        <option value="teknoloji">Teknoloji</option>
                        <option value="finans">Finans</option>
                        <option value="dekorasyon">Dekorasyon</option>
                    </select>
                    <textarea name="content" placeholder="Metin giriniz." cols="30" rows="20" required></textarea>
                    <input type="file" name="file" required />
                    <button>{shared === true ? 'Paylaşılıyor...' : 'Paylaş'}</button>
                </form>
                 : <p>Gönderi paylaşmak için giriş yapmalısınız.</p>}
            </div>
        </div>
    )
}