import { Clear, Done } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardContent,
  Collapse,
  Stack,
  styled,
  Typography,
  FormControl,
  TextField,
  InputLabel,
  BottomNavigation,
  BottomNavigationAction
} from "@mui/material";
import moment from "moment";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { setgroups } from "process";
import React from "react";
import { FileTable, useFileStorage, useUpload } from "ui";
import { useDownloadByFid } from "ui";
import { Config } from "../configs/config";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SubwayIcon from '@mui/icons-material/Subway';
import { useMetaMask } from "metamask-react";

interface Props {
  page: number;
}

const Input = styled("input")({
  display: "none",
});

const width = "80vw";

export default function Upload({ page }: Props) {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const { download_by_fid } = useDownloadByFid();
  const [FID, setFID] = React.useState<string>("");
  const [groupid,setGroupid] = React.useState<number>(1);
  const { files } = useFileStorage({
    start: (page - 1) * Config.defaultNumberPerPage,
    end: page * Config.defaultNumberPerPage,
  });
  const { file, setFile, upload, isUploading } = useUpload({
    days: Config.defaultStoredDuration,
  });
  const [value, setValue] = React.useState<any>("");
  const router = useRouter();

  const submitForm = (event: React.FormEvent<HTMLFormElement>) =>
  {
    event.preventDefault();
    // console.log(FID);
    // alert(FID);
    download_by_fid(FID, "download.txt");

  };
  return (
    <Stack alignItems={"center"} width="100vw" spacing={2}>
          <SubwayIcon sx={{ fontSize:60 }} />
          <Button variant="outlined">Your account: {account}</Button>
            <div style={{ height: 80 }} />

            <Card variant="outlined" style={{ width }}>
        <CardContent>
          <CloudDownloadIcon fontSize="large"/>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack style={{width: "100%"}}>
              <Stack direction={"row"} alignItems="center" style={{width: "100%"}}>
                <form onSubmit={submitForm} style={{width: "100%"}} >
                    <TextField
                      fullWidth
                      id="standard-basic"
                      label="Enter Encrypted FileID"
                      variant="standard"
                      value={FID}
                      onChange={e => setFID(e.target.value)} />
                    <Button type="submit">Download</Button>
                </form>

              </Stack>
            </Stack>

          </Stack>
        </CardContent>
      </Card>

      <div style={{ height: 10 }} />
      <Card variant="outlined" style={{ width }}>
        <CardContent>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack>
              <CloudUploadIcon fontSize="large"/>
              <Stack direction={"row"} alignItems="center">
                <Typography fontWeight={"bold"}>
                  {file?.name ?? "No file selected"}
                </Typography>
                <Collapse in={file !== undefined}>
                  <div>
                    <LoadingButton
                      loading={isUploading}
                      loadingPosition="start"
                      startIcon={<Done color="success" />}
                      onClick={async () => {
                        window.alert("Group " + groupid.toString() + " has permitions of this file.");
                        await upload(groupid);
                      }}
                    />

                    <LoadingButton
                      startIcon={<Clear color="error" />}
                      loadingPosition="start"
                      onClick={() => {
                        setFile(undefined);
                        setValue("");
                      }}
                    />
                  </div>
                </Collapse>
              </Stack>
            </Stack>
            {/* <TextField
                      id="standard-basic"
                      label="Permission Group ID"
                      variant="standard"
                      style={{ width: 150 }}
                      onChange={e => setGroupid(parseInt(e.target.value))} /> */}

            <label htmlFor="icon-button-file">
            <TextField
                      id="standard-basic"
                      label="Permission Group ID"
                      variant="standard"
                      style={{ width: 150 }}
                      onChange={e => setGroupid(parseInt(e.target.value))} />

              <Input
                accept="*/*"
                id="icon-button-file"
                type="file"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }}
              />

              <Button component="span">Upload</Button>
            </label>
          </Stack>
        </CardContent>
      </Card>
      <FileTable
        rows={
          files?.files.map((f: any, index: number) => ({
            id: (page - 1) * Config.defaultNumberPerPage + index,
            fid: f.fileId,
            type: f.fileType,
            name: f.fileName,
            date: `${moment(f.fileCreated.toNumber())}`,
            size: f.fileSize,
          })) ?? []
        }
        width={width}
        pageSize={Config.defaultNumberPerPage}
        numPages={Math.ceil(
          ((files?.count as number) ?? 1) / Config.defaultNumberPerPage
        )}
        currentPage={page}
        onPageChange={(page: number) => {
          router.push(`/upload?page=${page}`);
        }}
      />
      <BottomNavigation
          showLabels
          value={value}
        >
          <BottomNavigationAction label="Recents" icon={<RestoreIcon sx={{ fontSize:30 }} color="action"/>} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon sx={{ fontSize:30 }} color="action"/>} />
          <BottomNavigationAction label="Notification" icon={<NotificationsNoneIcon sx={{ fontSize:30 }} color="action"/>} />
        </BottomNavigation>


    </Stack>

  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const page = parseInt((ctx.query.page as string) || "1");

  return {
    props: {
      page,
    },
  };
};
