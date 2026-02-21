import { ShareCard } from "@/components/share/ShareCard";
import { themes, ThemeName } from "@/components/share/themes";

type Props = {
  searchParams: {
    title?: string;
    username?: string;
    status?: string;
    type?: string;
    rating?: string;
    theme?: string
  };
};

export default async function SharePreviewPage({ searchParams }: Props) {
    // ✅ Next 15 precisa disso
  const params = await searchParams;  
  console.log("PARAMS:", params);

  const {
    title = "Título",
    username = "user",
    status = "finished",
    type = "movie",
    rating = "rating",
    theme: themeParam
  } = params;

    const theme: ThemeName =
  themeParam && themeParam in themes
    ? (themeParam as ThemeName)
    : "dark";


  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0b0b0b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ShareCard
        title={title}
        username={username}
        status={status}
        type={type}
        rating={
        rating !== undefined && rating !== null && rating !== ""
          ? Number(rating)
          : undefined
        }
        theme={theme}
      />
    </main>
  );
}
