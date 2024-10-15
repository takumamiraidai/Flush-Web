'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion";
import Loading from './ui/Loading';

const AnimatedComponent = () => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // アニメーション完了を待つ
    const animationDuration = 30; // 3秒のアニメーションと仮定
    const transitionDuration = 10; // アニメーション後2秒で遷移

    // アニメーション完了後にフラグを立てる
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, animationDuration);

    // アニメーション完了後に遷移する
    const transitionTimer = setTimeout(() => {
      router.push('/root'); // 遷移先のURL
    }, animationDuration + transitionDuration);

    // クリーンアップ関数でタイマーをクリア
    return () => {
      clearTimeout(animationTimer);
      clearTimeout(transitionTimer);
    };
  }, [router]);

  return (
    <AnimatePresence>
      {loading && (
        <>
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loading />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnimatedComponent;
