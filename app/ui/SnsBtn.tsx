'use client';
import styled from '@emotion/styled'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import auth from '../firebaseConfig';

const Button = styled.a`
  display: grid;
  place-content: center;
  padding: 5px 5px;
  margin: 5px;
  font-size: 14px;
  text-decoration: none;
`

const TwitterButton = styled(Button)`
  background-color: #55acee;
  color: #fff;
`

const x_url = 'https://x.com/takuma110303/'
const i_url = 'https://www.instagram.com/neohello_2024/'
const g_url = 'https://github.com/takumamiraidai/'

const SnsBtns = () => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); 
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setError(null); // エラーメッセージをリセット
      console.log("Googleサインインを開始します");
      const result = await signInWithPopup(auth, provider);
      console.log("サインイン成功:", result.user);
    } catch (error: any) {
      console.log("サインインエラー:", error); // 詳細なエラーログを追加
      if (error.code === 'auth/popup-closed-by-user') {
        setError('ポップアップが閉じられました。再度お試しください。');
      } else if (error.code === 'auth/network-request-failed') {
        setError('ネットワークエラーが発生しました。インターネット接続を確認してください。');
      } else {
        setError('サインイン中にエラーが発生しました。');
      }
    }
  };

  return (
    <div className="flex">
        <Button href={x_url} target="_blank" rel="noopener noreferrer">
                <Image
                    src="/snsicon/x_logo-black.png"
                    alt="Twitter"
                    width="20"
                    height="20"
                    className='w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] lg:w-[35px] lg:h-[35px]'
                  />
        </Button>
        <Button href={i_url } target="_blank" rel="noopener noreferrer">
                <Image
                    src="/snsicon/instagram_logo_black.png"
                    alt="Instagram"
                    width="20"
                    height="20"
                    className='w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] lg:w-[35px] lg:h-[35px]'
                  />
        </Button>
        <Button href={g_url} target="_blank" rel="noopener noreferrer">
                <Image
                    src="/snsicon/github-logo.png"
                    alt="GitHub"
                    width="20"
                    height="20"
                    className='w-[20px] h-[20px] sm:w-[26px] sm:h-[25px] lg:w-[35px] lg:h-[35px]'
                  />
        </Button>

        <Button onClick={signInWithGoogle} target="_blank" rel="noopener noreferrer">
          <Image
            src={user ? "/pic/home/login_open.png" : "/pic/home/login_close.png"} // ユーザーがログインしているかどうかで画像を切り替え
            alt="Google Sign-In"
            width="20"
            height="20"
            className='w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] lg:w-[35px] lg:h-[35px]'
          />
        </Button> 

    </div>
  )
}
export default SnsBtns