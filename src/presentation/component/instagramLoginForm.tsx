"use client"

import {Alert, Container, Stack, TextField, TextFieldProps, Typography} from "@mui/material";
import instagramIcon from "@/../public/instagram.png"
import Image from "next/image";
import {actionLogin, actionTwoFactorLogin} from "@/presentation/actions";
import {useAction} from "next-safe-action/hook";
import {LoadingButton} from "@mui/lab";
import {useRef} from "react";

export function InstagramLoginForm() {

    const formRef = useRef<HTMLFormElement>(null)

    const {execute: login, status: loginStatus, result: {data}, reset} = useAction(actionLogin, {
        onSuccess: () => formRef.current?.reset()
    })

    const {execute: twoFactorLogin, status: twoFactorLoginStatus} = useAction(actionTwoFactorLogin, {
        onSuccess: () => {
            reset()
            formRef.current?.reset()
        }
    })

    const status = data ? twoFactorLoginStatus : loginStatus

    return <Container maxWidth="xs">
        <form
            ref={formRef}
            onSubmit={(event) => {
                event.preventDefault()

                const formData = new FormData(event.currentTarget)

                if (data) {
                    twoFactorLogin(formData)
                } else {
                    login(formData)
                }
            }}
        >
            <Stack alignItems="center" gap={2}>

                <Image src={instagramIcon} alt="아이콘" width={64}/>

                {
                    status == "hasErrored" &&
                    <Alert severity="error">로그인에 실패 했습니다</Alert>
                }

                {
                    data ?
                        <>
                            <LoginTextField autoFocus name="code" label="2단계 인증 번호"/>

                            <input hidden name="twoFactorId" value={data}/>
                        </>
                        :
                        <>
                            <LoginTextField name="username" label="사용자 이름"/>

                            <LoginTextField name="password" label="비밀번호" type="password"/>
                        </>
                }

                <LoadingButton
                    loading={status == "executing"}
                    type="submit"
                    fullWidth
                    variant="outlined"
                    size="large"
                >
                    <Typography fontWeight="bolder">로그인</Typography>
                </LoadingButton>
            </Stack>
        </form>
    </Container>
}

function LoginTextField(props: TextFieldProps) {
    return <TextField fullWidth required  {...props}/>
}