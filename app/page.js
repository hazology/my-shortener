/* 파일 경로: app/page.js (상단부만 수정) */
"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../lib/supabaseClient";
import { toUnicode, toASCII } from "punycode";
import Image from 'next/image'; 

// --- 올바른 컴포넌트 임포트 ---
import styles from "./page.module.css";
import InfoSidebar from "../components/InfoSidebar";
import StyledInput from "../components/StyledInput";
import SubmitButton from "../components/SubmitButton";
import PrefixedInput from "../components/PrefixedInput";
import StyledSelect from "../components/StyledSelect";

const qrImageSettings = {
  src: "/images/character-wooli.png", 
  height: 40,
  width: 40,
  excavate: true,
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expiry, setExpiry] = useState("7d");
  const [shortCode, setShortCode] = useState(""); 
  
  // (!! 수정 !!) 
  // user 상태를 Header가 직접 관리하므로 page.js의 user 상태와 useEffect는 제거합니다.
  // const [user, setUser] = useState(null);
  // useEffect(() => { supabase.auth.getUser().then(({ data }) => { setUser(data.user ?? null); }); }, []);
  
  // (함수는 생략)
  async function handleSubmit(e) { /* ... */ }
  let functionalShortUrl = ""; let displayShortUrl = ""; if (shortCode) { /* ... */ }
  async function copyToClipboard() { /* ... */ }

  return (
    <div className={styles.wrapper}>
      <InfoSidebar />

      <section className={styles.mainContent}>
        <h2 className={styles.title}>긴~주소 짧게 줄이기</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          <StyledInput
            label="원본 주소(url)"
            type="url"
            placeholder="긴 URL을 입력하세요"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <div className={styles.arrowWrapper}>
            <Image
              src="/icons/arrow-down.svg" 
              alt="아래 화살표"
              width={24} 
              height={24}
            />
          </div>

          <div className={styles.selectWrapper}>
            <div className={styles.customCodeInput}>
              <PrefixedInput
                label="단축 주소"
                placeholder="나만의 단축 주소 (한글, 영어, 숫자)"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
              />
            </div>

            <div>
              <StyledSelect
                label="유지 기간"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              >
                <option value="7d">1주</option>
                <option value="30d">1달</option>
                {/* (!! 수정 !!) user 변수가 없으므로, 
                   로그인 여부와 관계없이 옵션을 표시하거나
                   별도 상태로 관리해야 합니다. 우선은 user 없이 표시되도록 수정합니다.
                   (이 부분은 추후 로그인 상태를 다시 받아와야 할 수 있습니다.)
                */}
                {/* {user && ( */}
                  <>
                    <option value="180d">6달</option>
                    <option value="365d">1년</option>
                    <option value="forever">무제한</option>
                  </>
                {/* )} */}
              </StyledSelect>
            </div>
          </div>

          {/* 이 SubmitButton이 울리 캐릭터를 포함하고 있습니다 */}
          <SubmitButton />
        </form>

        {shortCode && ( 
          <div className={styles.resultCard}>
            {/* ... (결과 카드 내용은 동일) ... */}
          </div>
        )}
      </section>
    </div>
  );
}