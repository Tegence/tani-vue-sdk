import imageCompression from 'browser-image-compression';

export const convertBase64StringToFile = (
    base64String: string,
    filename: string
  ) => {
    const arr = base64String.split(',');
    const mime = arr[0]?.match(/:(.*?);/)![1];
    if (!arr[1]) throw new Error("Missing base64 data");
    const bstr = window.atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new File([u8arr], filename, { type: mime });
};

export const handleImageCompression = async (file: File) => {
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error(error);
      return;
    }
};

export const fetchAndProcessImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type });
  
      const compressedFile = await handleImageCompression(file);
      if(compressedFile){
        return new File([compressedFile], file.name, { type: file.type });
      }else{
        return file;
      }
      
    } catch (error) {
      console.error("Error fetching or processing image:", error);
      return null;
    }
};