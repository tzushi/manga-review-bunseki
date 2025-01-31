import { Header } from "@/components/Header";
import { ReviewCard } from "@/components/ReviewCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const fetchReviews = async () => {
  const { data, error } = await supabase
    .from("manga_reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

const Index = () => {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ["manga_reviews"],
    queryFn: fetchReviews,
  });

  console.log("Fetched reviews:", reviews);

  if (error) {
    console.error("Error fetching reviews:", error);
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">新着レビュー分析</h2>
            <p className="text-muted-foreground">
              人気マンガ作品のレビューを深く分析し、その魅力を探ります
            </p>
          </div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/9] rounded-lg bg-gray-200" />
                  <div className="mt-4 space-y-3">
                    <div className="h-6 w-2/3 rounded bg-gray-200" />
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews?.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id.toString()}
                  title={review.title}
                  coverImage={review.amazon_image_url || "/placeholder.svg"}
                  summary={review.content.substring(0, 150) + "..."}
                  date={format(new Date(review.created_at), "yyyy年MM月dd日", {
                    locale: ja,
                  })}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
