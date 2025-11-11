"use client"; // (!! 중요 !!) Client Component로 변경

import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { supabase } from '../lib/supabaseClient'; // (!! 추가 !!) Supabase 클라이언트 임포트

export default function Header() {
  // (!! 추가 !!) 사용자 상태 관리
  const [user, setUser] = useState(null);
  // (!! 추가 !!) auth 로딩 상태 관리
  const [loading, setLoading] = useState(true);

  // (!! 추가 !!) Supabase 인증 상태 리스너
  useEffect(() => {
    // 1. 컴포넌트 마운트 시 현재 사용자 정보 가져오기
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    
    fetchUser();

    // 2. 인증 상태 변경(로그인, 로그아웃) 시 user 상태 업데이트
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);
        
        // (!! 수정 !!) 
        // /login 페이지가 없으므로 관련 리다이렉트 로직 제거
      }
    );

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // (!! 수정 !!) Google 로그인 함수
  const handleGoogleLogin = async () => {
     // (!! 수정 !!) /login 페이지로 이동하는 대신, 여기서 바로 OAuth 실행
     const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // 사용자가 로그인 후 돌아올 페이지를 지정합니다.
        // !! 중요: 이 URL을 Supabase 대시보드 > Authentication > URL Configuration > Redirect URLs 에 추가해야 합니다.
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
      alert("Google 로그인 중 오류가 발생했습니다.");
    }
  };

  // (!! 추가 !!) 로그아웃 함수
  const handleLogout = async () => {
    if (confirm("정말 로그아웃하시겠습니까?")) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
      } else {
        // 상태 리스너가 user를 null로 변경하므로 별도 리다이렉트 불필요
        // (필요시 window.location.href = "/"; 추가)
      }
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        
        <Link href="/">
          <Image 
            src="/images/logo-woori-ai.svg" 
            alt="우리아이 로고"
            width={180}
            height={50}
            className={styles.logo}
            priority
          />
        </Link>
        
        {/* (!! 수정 !!) 인증 상태에 따라 버튼 동적 표시 */}
        <div className={styles.authContainer}>
          {loading ? (
            // 로딩 중 (버튼 크기만큼 공간만 차지)
            <div className={styles.myUrlButton} style={{ visibility: 'hidden' }}>
              ...
            </div>
          ) : user ? (
            // 2. 로그인 상태: "나의 URL" + "로그아웃"
            <>
              <Link href="/dashboard" className={styles.myUrlButton}>
                나의 URL
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                로그아웃
              </button>
            </>
          ) : (
            // 3. 로그아웃 상태: "우리아이 로그인"
            <button onClick={handleGoogleLogin} className={styles.myUrlButton}>
              우리아이 로그인
            </button>
          )}
        </div>
        
      </div>
    </header>
  );
}