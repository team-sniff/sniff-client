'use client';

import { Loading1, Loading2, Loading3, Loading4 } from '@/public/images';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/matchingtest/Header';

interface LoadingPageProps {
  searchParams: { [key: string]: string | undefined };
}

const Page = ({ searchParams }: LoadingPageProps) => {
  const router = useRouter();
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const icons = [<Loading1 />, <Loading2 />, <Loading3 />, <Loading4 />];
  const lastIconIndex = icons.length - 1;

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value);
      }
    });

    let timer: NodeJS.Timeout;
    if (currentIconIndex === lastIconIndex) {
      timer = setTimeout(() => {
        router.push(`/result?${params.toString()}`);
      }, 1500);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [router, searchParams, currentIconIndex, lastIconIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIconIndex < lastIconIndex) {
        setCurrentIconIndex((prevIndex) => prevIndex + 1);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentIconIndex, lastIconIndex]);

  return (
    <div className="mx-[17px]">
      <Header />
      <div className="h0 mt-[51px]">
        <div>당신에게 딱 어울리는 향을 </div>
        <div>추출하고 있어요!</div>
      </div>
      <div className="flex justify-center items-center mt-[126px] mb-[110px]">
        {icons[currentIconIndex]}
      </div>
      <div className="border border-acodegray-100 bg-acodegray-100 flex justify-center items-center h-[106px]">
        광고
      </div>
    </div>
  );
};
export default Page;