import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

interface FileToDownload {
  url: string;
  name: string;
}

export const downloadAllAsZip = async (files: FileToDownload[], zipName: string) => {
  if (files.length === 0) {
    toast.error('No files to download');
    return;
  }

  const zip = new JSZip();
  const loadingToast = toast.loading(`Preparing ${files.length} files for download...`);
  
  try {
    const results = await Promise.allSettled(
      files.map(async (file) => {
        const response = await fetch(file.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${file.name}`);
        }
        const blob = await response.blob();
        return { file, blob };
      })
    );

    const successful: { file: FileToDownload; blob: Blob }[] = [];
    const failed: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(result.value);
      } else {
        failed.push(files[index].name);
      }
    });

    if (successful.length === 0) {
      toast.error('Failed to download any files');
      return;
    }

    // Handle duplicate filenames by appending numbers
    const usedNames = new Set<string>();
    successful.forEach(({ file, blob }) => {
      let fileName = file.name;
      let counter = 1;
      
      while (usedNames.has(fileName)) {
        const lastDotIndex = file.name.lastIndexOf('.');
        if (lastDotIndex > 0) {
          const name = file.name.substring(0, lastDotIndex);
          const extension = file.name.substring(lastDotIndex);
          fileName = `${name} (${counter})${extension}`;
        } else {
          fileName = `${file.name} (${counter})`;
        }
        counter++;
      }
      
      usedNames.add(fileName);
      zip.file(fileName, blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, zipName);

    toast.dismiss(loadingToast);
    
    if (failed.length > 0) {
      toast.warning(`Downloaded ${successful.length} files, ${failed.length} failed`);
    } else {
      toast.success(`Downloaded ${successful.length} files as zip`);
    }
  } catch (error) {
    toast.dismiss(loadingToast);
    console.error('Error creating zip:', error);
    toast.error('Failed to create zip file');
  }
};