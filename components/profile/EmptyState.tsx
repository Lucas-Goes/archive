export function EmptyState({ isOwner }: { isOwner?: boolean }) {
  return (
    <div className="w-full flex items-start justify-center">

      <div className="text-center space-y-3">

        <p className="text-sm text-white/40">
          esse archive ainda está vazio
        </p>

        {isOwner && (
          <p className="text-sm text-white/40">
            você pode começar quando quiser
          </p>
        )}

      </div>

    </div>
  );
}
