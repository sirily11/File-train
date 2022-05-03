import { useContext, useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useMetaMask } from "metamask-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { AppTitle } from "ui";
import { ArrowCircleRight, ArrowRight } from "@mui/icons-material";
import SubwayIcon from '@mui/icons-material/Subway';
import qs from "query-string";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [value, setValue] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (status === "connected") {
      setValue(account);
    }
  }, [status, account]);

  return (
    <Stack alignItems={"center"}>
           
      <SubwayIcon sx={{ fontSize:60 }}/>
      <AppTitle
        title={"File Train"} 
        descriptions={[
          "A cloud storage service that allows enterprises to share files among their employees with permission control",
        ]}
        isLoading={loading}
        walletAddress={value}
        isConnectingMetaMask={status === "connecting"}
        isConnected={status === "connected"}
        actionIcon={<ArrowCircleRight fontSize="large" />}
        actionText={"Next Page"}
        onClickAction={async () => {
          setLoading(true);
          await router.push("/upload");
          setLoading(false);
        }}
        onConnectMetaMaskClick={async () => await connect()}
        onTextEnter={(v) => setValue(v)}
        metamaskOnly={false}
      />
    </Stack>
  );
};

export default Home;
