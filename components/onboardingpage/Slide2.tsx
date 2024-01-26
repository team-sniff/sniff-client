import React from 'react';
import { Onboarding2 } from '@/public/images';

const Slide2 = () => {
  return (
    <div>
      <div className="h0 mt-12 px-4">
        <div>나의 취향과 어울리는</div>
        <div>제품과 계열까지 추천받는,</div>
      </div>
      <div className="body1 text-acodegray-400 px-4  pt-5">
        <div>향수 취향과 분위기를 기반으로</div>
        <div>어울리는 향수 계열과 제품 추천</div>
      </div>
      <div className="fixed bottom-0">
        <Onboarding2 />
      </div>
    </div>
  );
};
export default Slide2;
