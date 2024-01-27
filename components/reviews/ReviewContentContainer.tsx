'use client';

/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import React, { useState } from 'react';
import { useSession } from '@/hooks/useSession';
import InputStar from '@/components/reviews/InputStar';
import OnelineComment from '@/components/reviews/OnelineComment';
import KeyWordReview from '@/components/reviews/KeyWordReview';
import TextReview from '@/components/reviews/TextReview';
import InputPhoto from '@/components/reviews/InputPhoto';
import Modal from '@/components/reviews/Modal';
import { ErrorMessage1, ErrorMessage2, ErrorMessage3 } from '@/public/images';
import {
  intensityMappingR,
  longevityMappingR,
  seasonMappingR,
  styleMappingR,
} from '@/constants/stats';
import { useRouter } from 'next/navigation';

export async function getPresignedUrl(name: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/review/image/${name}`,
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.text();
  return data;
}

const ReviewContentContainer = ({ id }: { id: string }) => {
  const [starRating, setStarRating] = useState<number>(0);
  const [oneLineComment, setOneLineComment] = useState<string>('');
  const [textReview, setTextReview] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedPersistence, setSelectedPersistence] = useState<string>('');
  const [selectedIntensity, setSelectedIntensity] = useState<string>('');
  const [modalValue, setModalValue] = useState<string>('');
  const [starRatingError, setStarRatingError] = useState<boolean>(false);
  const [oneLineCommentError, setOneLineCommentError] =
    useState<boolean>(false);
  const [keyWordReviewError, setKeyWordReviewError] = useState<boolean>(false);
  const router = useRouter();

  const handleModalReturn = (value: any) => {
    setModalValue(value);
  };
  const session = useSession();
  const token = session?.jwt;

  const handleSubmit = async () => {
    let isValid = true;
    setStarRatingError(false);
    setOneLineCommentError(false);
    setKeyWordReviewError(false);

    if (starRating === 0) {
      setStarRatingError(true);
      isValid = false;
    }

    if (!oneLineComment.trim()) {
      setOneLineCommentError(true);
      isValid = false;
    }

    if (
      !selectedSeason.trim() ||
      !selectedPersistence.trim() ||
      !selectedIntensity.trim() ||
      !modalValue
    ) {
      setKeyWordReviewError(true);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const uploadedPhotoUrls = [];

    for (const photo of photos) {
      const photoName = photo.name;

      const presignedUrl = await getPresignedUrl(photoName);

      if (presignedUrl) {
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: photo,
        });

        if (!uploadResponse.ok) {
          return;
        }

        const url = new URL(presignedUrl);
        const requiredUrl = url.origin + url.pathname;
        uploadedPhotoUrls.push(requiredUrl);
      }
    }

    const translatedSeason = seasonMappingR[selectedSeason] || selectedSeason;
    const translatedPersistence =
      longevityMappingR[selectedPersistence] || selectedPersistence;
    const translatedIntensity =
      intensityMappingR[selectedIntensity] || selectedIntensity;
    let translatedModalValue = modalValue;
    if (Array.isArray(modalValue)) {
      translatedModalValue = modalValue
        .map((val) => styleMappingR[val] || val)
        .join(', ');
    } else {
      translatedModalValue = styleMappingR[modalValue] || modalValue;
    }

    const payload = {
      rate: starRating,
      comment: oneLineComment,
      season: translatedSeason,
      longevity: translatedPersistence,
      intensity: translatedIntensity,
      style: translatedModalValue,
      textReview: textReview || '',
      thumbnail: uploadedPhotoUrls[0] ? uploadedPhotoUrls[0] : '',
      image1: uploadedPhotoUrls[1] ? uploadedPhotoUrls[1] : '',
      image2: uploadedPhotoUrls[2] ? uploadedPhotoUrls[2] : '',
    };

    const headers = new Headers();
    headers.set('AUTHORIZATION', token!);

    const res = await fetch(`/api/reviewpage/${id}`, {
      method: 'POST',
      body: JSON.stringify({ payload }),
      headers,
    });

    if (!res.ok) {
      return;
    }

    // 서버로부터 반환된 응답을 로그로 출력
    // const responseData = await res.json();
    // console.log('Response from server:', responseData);
    router.refresh();
    router.push(`/perfumes/${id}?category=review`);
  };
  return (
    <>
      <InputStar onRatingChange={setStarRating} />
      {starRatingError && (
        <div className="my-3">
          <ErrorMessage1 />
        </div>
      )}
      <hr className="my-11 mx-4 border-t-[1.5px] border-acodegray-50" />
      <OnelineComment onChange={setOneLineComment} />
      {oneLineCommentError && (
        <div className="my-3">
          <ErrorMessage2 />
        </div>
      )}
      <hr className="my-11 mx-4 border-t-[1.5px] border-acodegray-50" />
      <KeyWordReview
        selectedSeason={selectedSeason}
        selectedPersistence={selectedPersistence}
        selectedIntensity={selectedIntensity}
        onSeasonSelect={setSelectedSeason}
        onPersistenceSelect={setSelectedPersistence}
        onIntensitySelect={setSelectedIntensity}
      />

      <Modal onReturn={handleModalReturn} />
      {keyWordReviewError && (
        <div className="my-3">
          <ErrorMessage3 />
        </div>
      )}
      <hr className="my-11 mx-4 border-t-[1.5px] border-acodegray-50" />
      <TextReview onChange={setTextReview} />
      <hr className="my-11 mx-4 border-t-[1.5px] border-acodegray-50" />
      <InputPhoto onChange={setPhotos} />
      <div className="flex justify-center pb-4">
        <button
          type="button"
          className="bg-acodeblack w-full text-white  py-3 px-4 rounded"
          onClick={() => handleSubmit()}
        >
          올리기
        </button>
      </div>
    </>
  );
};

export default ReviewContentContainer;
