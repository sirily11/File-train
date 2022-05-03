import { BrowserFile } from "@etherdata-blockchain/etherdata-sdk-file-browser";
import React from "react";
import CryptoJS from "crypto-js";

export  function useDownload() {
  const download = React.useCallback(
    async (fileId: string, fileName: string) => {
      try {
        const file = new BrowserFile(process.env.NEXT_PUBLIC_FILE_URL!);
        const key = "KUf4hM5rThssysJhcRFCfxLR8Imihjl0eMsyhh1M7Wk";
        const decrypted = (CryptoJS.AES.decrypt(fileId, key)).toString(CryptoJS.enc.Utf8);
        await file.downloadFile({ fileId: decrypted, downloadPath: fileName });
      } catch (err: any) {
        console.log(err);
        window.alert(`"Error downloading file: ${err}"`);
      }
    },
    []
  );
  return { download };
}
