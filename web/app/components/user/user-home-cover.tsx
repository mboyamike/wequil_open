import type { JSX } from "react";
import { useModal } from "~/lib/hooks/useModal";
import { Modal } from "../modal/modal";
import { ImageModal } from "../modal/image-modal";
import { Button } from "@headlessui/react";
import { NextImage } from "../ui/next-image";
import type { AppImageData } from "~/lib/types/file";


type UserHomeCoverProps = {
  coverData?: AppImageData | null;
};

export function UserHomeCover({ coverData }: UserHomeCoverProps): JSX.Element {
  const { open, openModal, closeModal } = useModal();

  return (
    <div className='mt-0.5 h-36 xs:h-48 sm:h-52'>
      <Modal open={open} closeModal={closeModal}>
        <ImageModal imageData={coverData as AppImageData} previewCount={1} />
      </Modal>
      {coverData ? (
        <Button
          className='accent-tab relative h-full w-full rounded-none p-0 transition hover:brightness-75'
          onClick={openModal}
        >
          <NextImage
            useSkeleton
            // layout='fill'
            imgClassName='object-cover'
            src={coverData.src}
            alt={coverData.alt}
            key={coverData.src}
          />
        </Button>
      ) : (
        <div className='h-full bg-light-line-reply dark:bg-dark-line-reply' />
      )}
    </div>
  );
}
