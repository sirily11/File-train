import { BrowserFile } from "@etherdata-blockchain/etherdata-sdk-file-browser";
import React from "react";
import { useFileStorage } from "./useFileStorage";
import CryptoJS from "crypto-js";
import { useMetaMask } from "metamask-react";


export  function useDownloadByFid() {

  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const { provider } = useFileStorage({  });

  const download_by_fid = React.useCallback(
    async (fileId: string, fileName: string) => {
      if(provider && status === 'connected'){
        ///isValid is fileName
        const isValid = await provider.check_permission(fileId,account);
        // console.log("Check permission: ", isValid);
        // window.alert(decrypt(k1.toHex(), encrypt(k1.publicKey.toHex(), data)).toString()
        // );
        // window.alert(account);
        if(isValid.length != 0){
          try {
            const file = new BrowserFile(process.env.NEXT_PUBLIC_FILE_URL!);
            const key = "KUf4hM5rThssysJhcRFCfxLR8Imihjl0eMsyhh1M7Wk";
            const decrypted = (CryptoJS.AES.decrypt(fileId, key)).toString(CryptoJS.enc.Utf8);
            await file.downloadFile({ fileId: decrypted, downloadPath: isValid });
          } catch (err: any) {
            console.log(err);
            window.alert(`"Error downloading file: ${err}"`);
          }
        }else{
          window.alert(`"No permission!"`);
        }
      }
    },
    [provider,account,status]
  );
  return { download_by_fid };
}
