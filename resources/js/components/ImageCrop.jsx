import { useEffect, useState } from 'react';
// import user1 from '../assets/user_1.jpg';
import MyModal from '@/components/MyModal';
import { readFile } from '@/helpers/cropImage';
import ImageCropModalContent from './ImageCropModalContent';
import { useImageCropContext } from '@/Providers/ImageCropProvider';

const ImageCrop = ({handleUpload,image,imgClassName="h-[192px] w-[192px]"}) => {
  const [openModal, setOpenModal] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
if (typeof image === 'string' || typeof image === undefined || !(image instanceof Blob)) {
  console.log('====================================');
  console.log(image);
  console.log('====================================');
  setPreview(image)
}else {
  setPreview(window.URL.createObjectURL(image));
}
  },[image])
  const { getProcessedImage, setImage, resetStates } = useImageCropContext();

  const handleDone = async () => {
    const avatar = await getProcessedImage();
    setPreview(window.URL.createObjectURL(avatar));
    handleUpload(avatar)
    resetStates();
    setOpenModal(false);
  };

  const handleFileChange = async ({ target: { files } }) => {
    const file = files && files[0];
    const imageDataUrl = await readFile(file);
    setImage(imageDataUrl);
    setOpenModal(true);
  };

  return (
    <div className="bg-gray-100 rounded-full h-fit  flex justify-center items-center">
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="avatarInput"
        accept="image/*"
      />
      <label htmlFor="avatarInput" className="cursor-pointer">
        <img
          src={preview}
          className={`object-cover rounded-full ${imgClassName}`}
          alt=""
        />
      </label>

      <MyModal open={openModal} handleClose={() => setOpenModal(false)}>
        <ImageCropModalContent handleDone={handleDone} handleClose={() => setOpenModal(false)} />
      </MyModal>
    </div>
  );
};

export default ImageCrop;
