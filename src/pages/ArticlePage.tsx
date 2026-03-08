import { useParams } from 'react-router-dom';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import { Component, type ReactNode } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ArticleLayout from '@/components/ArticleLayout';
import ArticleSEO from '@/components/ArticleSEO';
import { getPostBySlug, getAdjacentPosts } from '@/data/articles';
import { useLocalizedPost } from '@/data/useLocalizedArticle';
import { useAIBlogPosts } from '@/hooks/useAIBlogPosts';

// ─── Error Boundary Fallback ───
class ArticleErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// ─── Fallback layout (mirrors the old design) ───
const FallbackArticle = ({ slug }: { slug: string }) => {
  const navigate = useLocalizedNavigate();
  const post = getPostBySlug(slug);
  if (!post) return null;
  return (
    <div className="max-w-3xl mx-auto px-5 pt-24 pb-16">
      <button onClick={() => navigate('/blog')} className="text-primary hover:underline text-sm mb-8 block">
        ← Back to Blog
      </button>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-muted-foreground mb-8">{post.excerpt}</p>
      <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground">
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
      </div>
    </div>
  );
};

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useLocalizedNavigate();
  const { data: aiPosts = [] } = useAIBlogPosts();
  
  // Check static posts first, then AI-generated posts
  const rawPost = slug ? getPostBySlug(slug) : undefined;
  const aiPost = !rawPost && slug ? aiPosts.find(p => p.slug === slug) : undefined;
  const resolvedPost = rawPost || aiPost;
  const post = rawPost ? useLocalizedPost(rawPost) : resolvedPost;

  if (!post) {
    return (
      <>
        <Navigation />
        <PageTransition>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Article not found</h1>
              <button onClick={() => navigate('/blog')} className="text-primary hover:underline">
                ← Back to Blog
              </button>
            </div>
          </div>
        </PageTransition>
      </>
    );
  }

  const { prev, next } = rawPost ? getAdjacentPosts(post.slug, post.section) : { prev: undefined, next: undefined };

  return (
    <>
      <Navigation />
      <ArticleSEO post={post} />
      <PageTransition>
        <ArticleErrorBoundary fallback={<FallbackArticle slug={post.slug} />}>
          <ArticleLayout post={post} prev={prev} next={next} />
        </ArticleErrorBoundary>
        <Footer />
      </PageTransition>
    </>
  );
};

export default ArticlePage;
