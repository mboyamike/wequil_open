export type AppImageData = {
  src: string;
  alt: string;
  type?: string;
};

export type ImagesPreview = (AppImageData & {
  id: string;
})[];

export type ImagePreview = AppImageData & { id: string };
export type FileWithId = File & { id: string };

export type FilesWithId = (File & {
  id: string;
})[];
