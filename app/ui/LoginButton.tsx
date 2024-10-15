'use client';
import styled from '@emotion/styled'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
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

const LoginButton = () => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // メールアドレス形式を検証する関数
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@fun.ac.jp$/; // fun.ac.jpドメインに制限
    return emailPattern.test(email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        if (email && !validateEmail(email)) {
          setError('fun.ac.jpドメインのメールアドレスでサインインしてください');
          signOut(auth);
          setUser(null);
        } else {
          setUser(user);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setError(null); // エラーメッセージをリセット
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (email && !validateEmail(email)) {
        setError('許可されていないメールアドレス形式です');
        await signOut(auth); 
      } else {
        console.log("サインイン成功:", result.user);
      }
    } catch (error: any) {
      console.log("サインインエラー:", error);
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
      <Button onClick={signInWithGoogle} target="_blank" rel="noopener noreferrer">
        <Image
          src={user ? "/pic/home/login_open.png" : "/pic/home/login_close.png"}
          alt="Google Sign-In"
          width="20"
          height="20"
          className='w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] lg:w-[35px] lg:h-[35px]'
        />
      </Button> 
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
export default LoginButton;
