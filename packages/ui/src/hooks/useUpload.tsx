import {
  BrowserFile,
  BrowserFileObject,
} from "@etherdata-blockchain/etherdata-sdk-file-browser";
import { BigNumber } from "ethers";
import { StorageFile } from "file-storage-contract";
import moment from "moment";
import React, { useCallback, useEffect } from "react";
import CryptoJS from "crypto-js";
import { useFileStorage } from "./useFileStorage";


export function useUpload({ days }: { days: number }) {
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [fileId, setFileId] = React.useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = React.useState(false);
  const { provider } = useFileStorage({  });



  let group: string[][] = [['0x6B50b4468488DfF29979BEf9a7aF145d6648a7E1'.toLocaleLowerCase(),'0x157150a7aa199472ea6d803ac91d3edd30a8e659'], ['0x6b50b4468488dff29979bef9a7af145d6648a7e1']];

  const upload = useCallback(async (groupid:number) => {
    if (file && provider) {
      setIsUploading(true);
      try {
        const browserFile = new BrowserFile(process.env.NEXT_PUBLIC_FILE_URL!);
        const fileObject = new BrowserFileObject({
          file: file,
          days: days,
        });
        const fileId = await browserFile.uploadFile(fileObject);

        const key = "KUf4hM5rThssysJhcRFCfxLR8Imihjl0eMsyhh1M7Wk";
        const encrypted = (CryptoJS.AES.encrypt(fileId, key)).toString();
                
        const storageFile: StorageFile = {
          fileId: encrypted,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileOwner: provider.address,
          fileCreated: BigNumber.from(moment().valueOf()).toString(),
        };
        // encrypt
        // const EFID = []
        const tx = await provider.addFile(storageFile,group[groupid-1]);
        await tx.wait();
        setFileId(encrypted);
      } catch (err) {
        console.log(err);
        window.alert("Cannot upload file");
      } finally {
        setIsUploading(false);
        setFile(undefined);
      }
    }
  }, [file, provider]);
  return { file, setFile, upload, isUploading };
}
