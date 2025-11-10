/* 파일 경로: components/SubmitButton.js */
import Image from 'next/image';
import styles from './SubmitButton.module.css';

export default function SubmitButton() {
  return (
    <button type="submit" className={styles.button}>
      <span className={styles.text}>URL 줄이기</span>
      
      <Image
        /* 1. (!! 수정 !!) 
           src="/images/character-wooli.png" -> src="/images/charac-intro01.svg"
        */
        src="/images/character-wooli.svg"
        alt="울리 캐릭터"
        width={300}  // (SVG 원본 크기에 맞게 조절하셔도 됩니다)
        height={300} // (CSS가 실제 크기를 제어합니다)
        className={styles.character}
        priority
      />
    </button>
  );
}