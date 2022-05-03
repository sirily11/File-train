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
  InputLabel
} from "@mui/material";
import moment from "moment";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { setgroups } from "process";
import React from "react";
import { FileTable, useFileStorage, useUpload } from "ui";
import { useDownloadByFid } from "ui";
import { Config } from "../configs/config";

interface Props {
  page: number;
}

const Input = styled("input")({
  display: "none",
});

const width = "80vw";

export default function Upload({ page }: Props) {
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
    console.log(FID);
    alert(FID);
    download_by_fid(FID, "download.txt");
    
  };
  return (
    <Stack alignItems={"center"} width="100vw" spacing={2}>
            <div style={{ height: 120 }} />

            <Card variant="outlined" style={{ width }}>
        <CardContent>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack>
              <Stack direction={"row"} alignItems="center">
                <form onSubmit={submitForm} >
                    <TextField 
                      id="standard-basic" 
                      label="FileID" 
                      variant="standard" 
                      style={{ width: 1050 }}
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
              <Typography>Upload</Typography>
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
                        window.alert("Group " + groupid.toString() + " has permissions of this file.");
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
            <TextField 
                      id="standard-basic" 
                      label="Permission Group" 
                      variant="standard" 
                      style={{ width: 150 }}
                      onChange={e => setGroupid(parseInt(e.target.value))} />

            <label htmlFor="icon-button-file">
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
