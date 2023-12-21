"use client"
import {Alert, Box} from "@mui/material";
import {actionConfirm} from "@/presentation/actions";
import {useAction} from "next-safe-action/hook";
import {LoadingButton} from "@mui/lab";

export function LoginWarningAlert() {

    const {execute, status} = useAction(actionConfirm)

    return <Box
        sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100vh",
            position: "absolute",
            zIndex: 1000,
            backdropFilter: "blur(4px)"
        }}
    >
        <Alert
            severity="warning"
            action={
                <LoadingButton
                    color="inherit"
                    size="small"
                    onClick={() => execute()}
                    loading={status == "executing"}
                >
                    확인
                </LoadingButton>
            }
            sx={{
                alignItems: "center"
            }}
        >
            이 사이트는 인스타그램 로그인을 필요로 합니다
            <br/>
            로그인에 사용된 정보는 어디에도 저장되지 않기에
            <br/>
            안심하고 사용하셔도 좋으나 정 못믿겠다면 쓰지 말던가
            <br/>
            누가 쓰라고 칼로 협박함?
        </Alert>
    </Box>
}