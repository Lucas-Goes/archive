/* =====================================================
  CONFIG
===================================================== */
export const dynamic = "force-dynamic";

/* =====================================================
  IMPORTS
===================================================== */
import { WorkCard } from "@/components/cards/WorkCard";
import { ProfileHeader } from "@/components/layout/ProfileHeader";
import { getUserByUsername, getWorksByUser } from "@/lib/queries";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SortMenu } from "@/components/ui/SortMenu";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { Footer } from "@/components/layout/Footer";
import { CreateWorkModal } from "@/components/ui/CreateWorkModal";
import { getCurrentUser } from "@/lib/auth";
import { syncUser } from "@/lib/syncUser";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { LoginButton } from "@/components/ui/LoginButton";
import { EmptyState } from "@/components/profile/EmptyState";
import { MyProfileButton } from "@/components/ui/MyProfileButton";
import { ensureUserProfile } from "@/lib/ensureUserProfile";

/* =====================================================
  PAGE
===================================================== */
export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  /* =========================
    PARAMS
  ========================= */
  const { username } = await params;
  const { sort } = await searchParams;

  /* =========================
    AUTH / USER
  ========================= */
  await ensureUserProfile();
  await syncUser();
  const currentUser = await getCurrentUser();

  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  const isOwner = currentUser?.id === user.id;
  const isLoggedIn = !!currentUser;

  /* =========================
    DATA
  ========================= */
  const works = await getWorksByUser(user.id, sort || "updated");

  /* =====================================================
    RENDER
  ===================================================== */
  return (
    <main className="page">
      <div className="page-container w-full max-w-5xl mx-auto">
        
        {/* =====================================================
          FLOATING ACTIONS (TOP RIGHT)
        ===================================================== */}
        <div className="floating-group top-right">
          {isLoggedIn ? <LogoutButton /> : <LoginButton />}
        </div>

        {/* THEME TOGGLE */}
        <div className="floating-group top-right secondary">
          <ThemeToggle />
        </div>

        {/* =====================================================
          FLOAT ACTION BUTTON (BOTTOM RIGHT)
        ===================================================== */}
        <div className="fab">
          {/* OWNER */}
          {isOwner && <CreateWorkModal />}

          {/* VISITOR */}
          {isLoggedIn && !isOwner && <MyProfileButton />}
        </div>

        {/* SORT 
        <div className="fixed top-6 right-25 z-50 flex gap-2">
          <SortMenu />
        </div>*/}

        {/* =====================================================
          PROFILE HEADER
        ===================================================== */}
        <ProfileHeader user={user} isOwner={isOwner} />

        {/* =====================================================
          PROFILE STATS
        ===================================================== */}
        <ProfileStats works={works} />

        {/* =====================================================
          WORK GRID / EMPTY STATE 
        ===================================================== */}
        <section className="works-section">
          {works && works.length > 0 ? (
            <div className="works-grid">
              {works.map((work) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  isOwner={isOwner}
                  username={user.username}
                />
              ))}
            </div>
          ) : (
            <div className="empty-wrapper">
              <EmptyState isOwner={isOwner} />
            </div>
          )}
        </section>

        {/* =====================================================
          FOOTER
        ===================================================== */}
        <Footer username={user.username} />
      </div>
    </main>
  );
}
