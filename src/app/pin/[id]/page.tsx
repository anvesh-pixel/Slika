import prisma from "@/lib/prisma";
import { currentUser as getClerkUser, auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import PinClient from "@/components/pin-client";

export default async function PinPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const authUser = await getClerkUser();
    const { userId } = await auth();

    const pinId = parseInt(id);
    if (isNaN(pinId)) {
        return notFound();
    }

    const pin = await prisma.pin.findUnique({
        where: { id: pinId },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true
                }
            },
            comments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            avatarUrl: true
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            },
            likes: true,
            saves: true
        }
    });

    if (!pin) {
        return notFound();
    }

    const isOwnPin = userId === pin.userId;
    const initialIsLiked = userId ? pin.likes.some(like => like.userId === userId) : false;
    const initialIsSaved = userId ? pin.saves.some(save => save.userId === userId) : false;

    return (
        <PinClient
            pin={pin}
            isOwnPin={isOwnPin}
            initialIsLiked={initialIsLiked}
            initialIsSaved={initialIsSaved}
            initialComments={pin.comments.map(c => ({
                id: c.id,
                content: c.content,
                createdAt: c.createdAt.toISOString(),
                user: {
                    id: c.user.id,
                    username: c.user.username || "Anonymous",
                    avatarUrl: c.user.avatarUrl
                }
            }))}
        />
    );
}
