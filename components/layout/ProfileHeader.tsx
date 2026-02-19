import { UserProfile } from "@/types/user";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { AvatarViewer } from "@/components/profile/AvatarViewer";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

interface ProfileHeaderProps {
  user: UserProfile;
  isOwner: boolean;
}

export function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  return (
    <section className="flex flex-col items-center text-center space-y-3">

      {/* AVATAR */}
      <div className="flex justify-center">
        {isOwner ? (
          <AvatarUpload
            userId={user.id}
            avatarUrl={user.avatar_url}
          />
        ) : (
          <AvatarViewer avatarUrl={user.avatar_url} />
        )}
      </div>

      {/* NAME + BIO */}
      <div className="space-y-1">

        {/* NOME + EDIT */}
        <div className="flex items-center justify-center gap-2">
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            {user.name || user.username}
          </h1>

          {isOwner && (
            <EditProfileModal
              name={user.name ?? ""}
              bio={user.bio ?? ""}
            />
          )}
        </div>

        {/* BIO */}
        <p
          className="text-sm"
          style={{ color: "var(--muted)" }}
        >
          {user.bio || ""}
        </p>

      </div>

    </section>
  );
}