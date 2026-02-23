<div className="relative">

  <CardBase
    work={work}
    showActions
    onMenuClick={() => setSoftMenuOpen((v) => !v)}
  />

  {/* MENU */}
  {softMenuOpen && (
    <div className="
      absolute top-12 right-2
      w-44
      rounded-xl
      border border-white/10
      bg-[#111]
      shadow-xl
      backdrop-blur-md
      overflow-hidden
      z-50
    ">

      <button
        onClick={handleShare}
        className="w-full text-left px-4 py-3 text-sm hover:bg-white/5"
      >
        Compartilhar
      </button>

      {isOwner && (
        <>
          <button
            onClick={handleEdit}
            className="w-full text-left px-4 py-3 text-sm hover:bg-white/5"
          >
            Editar
          </button>

          <button
            onClick={handleDeleteClick}
            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
          >
            Excluir
          </button>
        </>
      )}
    </div>
  )}

</div>