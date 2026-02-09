import { currentUser as getClerkUser, auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import ProfileClient from "@/components/profile-client";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const authUser = await getClerkUser();
    const { userId } = await auth();

    // Fetch user from our DB with follower counts
    let profileUser = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
            pins: {
                orderBy: { createdAt: "desc" },
            },
            saves: {
                include: { pin: true },
            },
            likes: {
                include: { pin: true },
            },
            _count: {
                select: {
                    followers: true,
                    following: true,
                }
            }
        }
    });

    // Determine if this is the user's own profile based on Clerk userId
    // This needs to be done before the notFound check, as we might lazy-sync
    const isOwnProfileCheck = userId && (
        authUser?.username === username ||
        authUser?.firstName?.toLowerCase()?.replace(/\s+/g, '_') === username ||
        (username === 'me')
    );

    if (!profileUser) {
        if (isOwnProfileCheck && authUser) {
            // Lazy sync: create the user in our DB if it's the own profile
            try {
                profileUser = await prisma.user.create({
                    data: {
                        id: authUser.id,
                        username: authUser.username || authUser.firstName?.toLowerCase()?.replace(/\s+/g, '_') || `user_${authUser.id.slice(-6)}`,
                        displayName: `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() || authUser.username || "Anonymous",
                        email: authUser.emailAddresses[0]?.emailAddress || "",
                        avatarUrl: authUser.imageUrl,
                    },
                    select: { // Use select here to match the type of profileUser above
                        id: true,
                        username: true,
                        displayName: true,
                        bio: true,
                        avatarUrl: true,
                        pins: {
                            orderBy: { createdAt: "desc" },
                        },
                        saves: {
                            include: { pin: true },
                        },
                        likes: {
                            include: { pin: true },
                        },
                        _count: {
                            select: {
                                followers: true,
                                following: true,
                            }
                        }
                    }
                });
            } catch (error) {
                console.error("Failed to lazy-sync user:", error);
                return notFound(); // If lazy sync fails, treat as not found
            }
        } else {
            return notFound();
        }
    }

    // If profileUser is still null after potential lazy sync, it's a 404
    if (!profileUser) {
        return notFound();
    }

    // Check if current user follows this profile
    const isFollowing = userId ? !!(await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: userId,
                followingId: profileUser.id,
            }
        }
    })) : false;

    // Re-evaluate isOwnProfile based on the actual profileUser.id
    const isOwnProfile = userId === profileUser.id;

    const profileData = {
        username: (profileUser as any).username || "",
        displayName: (profileUser as any).displayName || (profileUser as any).username || "User",
        bio: (profileUser as any).bio || "No bio yet. Tap edit to share your story. ✨",
        avatarUrl: (profileUser as any).avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(profileUser as any).username}`,
        userId: (profileUser as any).id,
        stats: {
            posts: (profileUser as any).pins.length,
            followers: (profileUser as any)._count.followers,
            following: (profileUser as any)._count.following,
        },
        isOwnProfile,
        isFollowing,
        createdItems: (profileUser as any).pins.map((p: any) => ({
            id: p.id,
            type: p.type as "image" | "video",
            url: p.imageUrl,
            title: p.title,
            height: 600
        })),
        savedItems: (profileUser as any).saves.map((s: any) => ({
            id: s.pin.id,
            type: s.pin.type as "image" | "video",
            url: s.pin.imageUrl,
            title: s.pin.title,
            height: 600
        })),
        likedItems: (profileUser as any).likes.map((l: any) => ({
            id: l.pin.id,
            type: l.pin.type as "image" | "video",
            url: l.pin.imageUrl,
            title: l.pin.title,
            height: 600
        })),
    };

    return (
        <main className="min-h-screen bg-background transition-colors duration-[2000ms]">
            <ProfileClient {...profileData} />
        </main>
    );
}
