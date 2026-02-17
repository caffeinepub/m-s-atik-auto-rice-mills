import { useGetSections } from '../hooks/useQueries';
import { LoadingState, ErrorState, EmptyState } from '../components/QueryState';

export default function AboutPage() {
  const { data: sections, isLoading, error, refetch } = useGetSections();

  if (isLoading) {
    return <LoadingState message="Loading about content..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load about content" onRetry={() => refetch()} />;
  }

  const aboutSections = sections?.filter((s) => 
    s.title.toLowerCase().includes('about') || 
    s.title.toLowerCase().includes('history') ||
    s.title.toLowerCase().includes('mission') ||
    s.title.toLowerCase().includes('vision')
  ) || [];

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">About Us</h1>
          
          {aboutSections.length === 0 ? (
            <EmptyState message="About content will be available soon. Please check back later." />
          ) : (
            <div className="space-y-12">
              {aboutSections.map((section) => (
                <div key={Number(section.id)} className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-semibold">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {aboutSections.length === 0 && (
            <div className="mt-12 bg-muted/30 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">M/S Atik Auto Rice Mills</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are a leading rice processing facility committed to delivering premium quality rice products. 
                With years of experience and state-of-the-art technology, we ensure that every grain meets the 
                highest standards of quality and purity.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
