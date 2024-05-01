import { useEffect, useState } from "react";
import { supabase } from "../main"

export default function Authentication() {

    const [usernameData, setUsernameData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('username')
                setUsernameData(profiles ? profiles : null);
        }
        fetchData();
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    
    async function handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        let { data, error } = await supabase.auth.signInWithPassword(formObj);

        if(error) {
            console.log(error)
            console.log(error.status)
            if(error.status === 400) {
                alert('Giriş bilgileri doğru değil!')
            }
        } else {
            window.location.href = '/';
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        if(formObj) {
            const sonuc = []
            usernameData?.map(x => (x.username === formObj.username && sonuc.push('evet')))
            if(sonuc[0] === 'evet') {
                alert('KULLANICI ADI ZATEN MEVCUT!')
                return;
            }
        }

        if(formObj.username.includes(' ')) {
            alert('Kullanıcı adında büyük harf, boşluk ve Türkçe karakter kullanmayınız!');
            return;
        }
        if (/[A-Z]/.test(formObj.username)) {
            alert('Kullanıcı adında büyük harf, boşluk ve Türkçe karakter kullanmayınız!');
            return;
        }
        if(formObj.username.includes('ş')) {
            alert('Kullanıcı adında büyük harf, boşluk ve Türkçe karakter kullanmayınız!');
            return;
        }
        if(formObj.username.includes('ı')) {
            alert('Kullanıcı adında büyük harf, boşluk ve Türkçe karakter kullanmayınız!');
            return;
        }
        if(formObj.username.includes('ğ')) {
            alert('Kullanıcı adında büyük harf, boşluk ve Türkçe karakter kullanmayınız!');
            return;
        }
        if(formObj.username.includes('ö')) {
            alert('Kullanıcı adında büyük harf, boşluk ve Türkçe karakter kullanmayınız!');
            return;
        }
        if(formObj.username.includes('ç')) {
            alert('Kullanıcı adında büyük harf, boşluk ve Türkçe karakter kullanmayınız!');
            return;
        }
        if(formObj.username.includes('ü')) {
            alert('Kullanıcı adında büyük harf, boşluk ve Türkçe karakter kullanmayınız!');
            return;
        }
        if(formObj.username.length > 12) {
            alert('Kullanıcı adınız 12 karakterden fazla karakter içeremez!');
            return;
        }


        
        let { data: signup, error: errorSignup } = await supabase.auth.signUp(formObj);

        if(!errorSignup) {
            const { data, error } = await supabase
                .storage
                .from('photos')
                .upload(`${signup?.user.id}/profile_pic/${signup?.user.id}.jpg`, formObj?.file);
            
            const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .insert([
                {
                    name: formObj.name,
                    surname: formObj.surname,
                    username: formObj.username,
                    email: formObj.email,
                    profile_pic: (formObj.file.name !== '' ? data?.fullPath : 'photos/no-image/user.jpg')
                }
            ])
            .select()

            alert('Kayıt olundu. Giriş Yapabilirsiniz!')
        }
        
    }

    return (
        <div className="authentication-page">
            <div className="container">
                <div>
                    <form onSubmit={handleLogin}>
                        <h1>Giriş Yap</h1>
                        <p>Bir hesabınız varsa giriş yapın.</p>
                        <input type="text" name="email" placeholder="E-posta giriniz."/>
                        <input type="password" name="password" placeholder="Şifre giriniz."/>
                        <button>Giriş Yap</button>
                    </form>
                </div>
                <div>
                    <form onSubmit={handleSignup}>
                        <h1>Kayıt Ol</h1>
                        <p>Bir hesabınız yoksa kayıt olun.</p>
                        <div>
                            <input autoComplete="off" type="text" name="name" placeholder="Ad giriniz." required/>
                            <input autoComplete="off" type="text" name="surname" placeholder="Soyad giriniz." required/>
                        </div>
                        <input autoComplete="off" type="text" name="username" placeholder="Kullanıcı adı giriniz." required/>
                        <input type="text" name="email" placeholder="E-posta giriniz." required/>
                        <input type="password" name="password" placeholder="Şifre giriniz." required/>
                        <input type="file" name="file" id=""/>
                        <button>Kayıt Ol</button>
                    </form>
                </div>
            </div>
        </div>
    )
}