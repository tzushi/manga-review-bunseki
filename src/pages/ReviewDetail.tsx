import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ReviewDetail = () => {
  const { id } = useParams();

  const { data: review, isLoading } = useQuery({
    queryKey: ["review", id],
    queryFn: async () => {
      console.log("Fetching review with ID:", id);
      const { data, error } = await supabase
        .from("manga_reviews")
        .select("*")
        .eq("id", parseInt(id as string))
        .maybeSingle();

      if (error) {
        console.error("Error fetching review:", error);
        throw error;
      }

      console.log("Fetched review data:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container max-w-4xl py-8">
          <div className="flex items-center justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container max-w-4xl py-8">
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              レビューが見つかりませんでした
            </h1>
            <Link
              to="/"
              className="mt-4 inline-flex items-center text-sm text-primary hover:text-primary/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              トップページに戻る
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container max-w-4xl py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
          <span className="text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <article className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-white px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                レビュー分析
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              {review.title}
            </h1>
            {review.amazon_url && (
              <a
                href={review.amazon_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-primary hover:text-primary/80"
              >
                Amazonで見る →
              </a>
            )}
          </div>

          <div className="divide-y divide-gray-100 bg-white px-6 py-8 prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                img: ({ node, ...props }) => (
                  <img className="w-full" {...props} />
                ),
                hr: () => null,
              }}
            >
              {review.content}
            </ReactMarkdown>

            {/* Amazonリンクユニット */}
            {review.amazon_url && (
              <div className="mt-8 flex items-center gap-4">
                <a
                  href={review.amazon_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4"
                >
                  <img
                    src={review.amazon_image_url}
                    alt={review.title}
                    className="h-24 w-auto rounded-md shadow-md"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{review.title}</p>
                    <p className="text-gray-600">Amazonで詳細を見る</p>
                  </div>
                </a>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
};

export default ReviewDetail;
