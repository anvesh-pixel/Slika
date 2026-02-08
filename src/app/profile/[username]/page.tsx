import { currentUser as getClerkUser, auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import ProfileClient from "@/components/profile-client";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const authUser = await getClerkUser();
    const { userId } = await auth();

    // Fetch user from our DB
    let profileUser = await prisma.user.findUnique({
        where: { username },
        include: {
            pins: {
                orderBy: { createdAt: "desc" }
            },
            saves: {
                include: { pin: true }
            },
            likes: {
                include: { pin: true }
            }
        }
    });

    const isOwnProfile = userId && (
        authUser?.username === username ||
        authUser?.firstName?.toLowerCase()?.replace(/\s+/g, '_') === username ||
        (username === 'me')
    );

    if (!profileUser) {
        if (isOwnProfile && authUser) {
            // Lazy sync: create the user in our DB if it's the own profile
            try {
                profileUser = await prisma.user.create({
                    data: {
                        id: authUser.id,
                        username: authUser.username || authUser.firstName?.toLowerCase()?.replace(/\s+/g, '_') || `user_${authUser.id.slice(-6)}`,
                        email: authUser.emailAddresses[0]?.emailAddress || "",
                        avatarUrl: authUser.imageUrl,
                    },
                    include: {
                        pins: true,
                        saves: { include: { pin: true } },
                        likes: { include: { pin: true } }
                    }
                });
            } catch (error) {
                console.error("Failed to lazy-sync user:", error);
            }
        } else {
            return notFound();
        }
    }

    const displayName = profileUser?.username || username.charAt(0).toUpperCase() + username.slice(1);

    const stats = {
        posts: profileUser?.pins.length || 0,
        followers: 0,
        following: 0
    };

    const createdItems = (profileUser as any)?.pins?.map((pin: any) => ({
        id: pin.id,
        type: pin.type as "image" | "video",
        url: pin.imageUrl,
        title: pin.title,
        height: 600
    })) || [];

    const savedItems = (profileUser as any)?.saves?.map((save: any) => ({
        id: save.pin.id,
        type: save.pin.type as "image" | "video",
        url: save.pin.imageUrl,
        title: save.pin.title,
        height: 600
    })) || [];

    const likedItems = (profileUser as any)?.likes?.map((like: any) => ({
        id: like.pin.id,
        type: like.pin.type as "image" | "video",
        url: like.pin.imageUrl,
        title: like.pin.title,
        height: 600
    })) || [];

    return (
        <ProfileClient
            username={profileUser?.username || username}
            displayName={displayName}
            bio={profileUser?.bio || "No bio yet. Tap edit to share your story. ✨"}
            avatarUrl={profileUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
            stats={stats}
            isOwnProfile={!!isOwnProfile}
            createdItems={createdItems}
            savedItems={savedItems}
            likedItems={likedItems}
        />
    );
}
