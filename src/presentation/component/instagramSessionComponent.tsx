"use client"

import {InstagramSessionDto} from "@/presentation/model/instagramSessionDto";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardActions,
    CardContent,
    Stack,
    styled,
    Typography
} from "@mui/material";
import Image from "next/image";
import {useAction} from "next-safe-action/hook";
import {actionGetNonFollowers, actionUnfollow} from "@/presentation/actions";
import {LoadingButton} from "@mui/lab";
import {ExpandMore} from "@mui/icons-material";
import {InstagramUser} from "@/application/model/instagramUser";
import {useEffect, useState} from "react";

const InstagramUserImage = styled(Image)({
    borderRadius: "50%",
})

export function InstagramSessionComponent({session}: { session: InstagramSessionDto }) {

    const {execute, status, result: {data}} = useAction(actionGetNonFollowers)

    const [users, setUsers] = useState<InstagramUser[]>()

    useEffect(() => setUsers(data), [data]);

    return <Card>
        <CardContent>
            <Image
                src={session.profileUrl}
                alt={session.name}
                width={100}
                height={100}
            />

            <Typography fontSize={18} fontWeight="bold">{session.id}</Typography>

            <Typography fontWeight="500">{session.name}</Typography>
        </CardContent>

        <CardActions>
            {
                users
                    ?
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore/>}>
                            <Typography color="lightblue">맞팔 X</Typography>
                            &nbsp;
                            {users.length}명
                        </AccordionSummary>

                        <AccordionDetails>
                            <Stack gap={2}>
                                {
                                    users.map(user => (
                                        <InstagramUserComponent
                                            key={user.id}
                                            sessionId={session.id}
                                            user={user}
                                            onUnfollowed={() => {
                                                setUsers(prevState => prevState?.filter(prevUser => prevUser.id != user.id))
                                            }}
                                        />
                                    ))
                                }
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                    :
                    <LoadingButton
                        loading={status == "executing"}
                        onClick={() => execute(session.id)}
                    >
                        체크
                    </LoadingButton>
            }
        </CardActions>
    </Card>
}

function InstagramUserComponent({sessionId, user, onUnfollowed}: {
    sessionId: string,
    user: InstagramUser,
    onUnfollowed: () => void
}) {

    const {execute, status} = useAction(actionUnfollow, {
        onSuccess: onUnfollowed
    })

    return <Stack gap={2} direction="row" alignItems="center">
        <InstagramUserImage
            src={user.profileUrl}
            alt={user.name}
            width={50}
            height={50}
        />

        <Stack>
            <Typography fontWeight="bold" fontSize={17}>{user.id}</Typography>

            <Typography>{user.name}</Typography>
        </Stack>

        <LoadingButton
            variant="outlined"
            color="error"
            loading={status == "executing"}
            onClick={() => execute({
                sessionId,
                targetId: user.id
            })}
        >
            언팔로우
        </LoadingButton>
    </Stack>
}