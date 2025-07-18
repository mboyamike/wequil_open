import { useModal } from "~/lib/hooks/useModal";
import { Modal } from "../modal/modal";
import type { JSX } from "react";
import { ImageModal } from "../modal/image-modal";
import { Button } from "@headlessui/react";
import { NextImage } from "../ui/next-image";
import type { AppImageData } from "~/lib/types/file";


type UserHomeAvatarProps = {
  profileData?: AppImageData | null;
};

export function UserHomeAvatar({
  profileData
}: UserHomeAvatarProps): JSX.Element {
  const { open, openModal, closeModal } = useModal();

  return (
    <div className='mb-8 xs:mb-14 sm:mb-16'>
      <Modal open={open} closeModal={closeModal}>
        <ImageModal
          imageData={
            { src: profileData?.src, alt: profileData?.alt } as AppImageData
          }
          previewCount={1}
        />
      </Modal>
      <Button
        className='accent-tab absolute -mt-3 aspect-square w-24 -translate-y-1/2 overflow-hidden p-0 
                   disabled:cursor-auto disabled:opacity-100 xs:w-32 sm:w-36
                   [&:hover>figure>span]:brightness-75'
        onClick={openModal}
        disabled={!profileData}
      >
        {profileData ? (
          <NextImage
            useSkeleton
            className='hover-animation relative h-full w-full bg-main-background
                       inner:!m-1 inner:rounded-full inner:transition inner:duration-200'
            imgClassName='rounded-full'
            src={profileData.src}
            alt={profileData.alt}
            // layout='fill'
            key={profileData.src}
          />
        ) : (
          <div className='h-full rounded-full bg-main-background p-1'>
            <div className='h-full rounded-full bg-main-sidebar-background' />
          </div>
        )}
      </Button>
    </div>
  );
}
