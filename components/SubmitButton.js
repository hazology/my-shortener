/* 파일 경로: components/SubmitButton.js (이 코드로 덮어쓰세요) */
import Image from 'next/image';
import styles from './SubmitButton.module.css';

export default function SubmitButton() {
  return (
    <button type="submit" className={styles.button}>
      <span className={styles.text}>URL 줄이기</span>
      
      <Image
        src="/images/character-wooli.svg"
        alt="울리 캐릭터"
        
        /* 1. (!! 수정 !!) 
           width/height를 300에서 240으로 20% 줄입니다.
        */
        width={240}  
        height={240} 
        
        className={styles.character}
        priority
      />
    </button>
  );
}