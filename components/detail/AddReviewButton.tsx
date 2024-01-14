import { EditIcon } from '@/public/images';

const AddReview = () => {
  return (
    <div className="fixed bottom-3 z-50 bg-white py-2 px-4 rounded-full flex items-center justify-center space-x-2 border-2 border-white shadow-lg">
      <button className="flex items-center">
        <EditIcon className="mr-2" />
        <div className="body2 text-center flex-1">리뷰 남기기</div>
      </button>
    </div>
  );
};

export default AddReview;