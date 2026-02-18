import { useGetSiteSettings, useGetSections } from '../hooks/useQueries';
import { LoadingState } from '../components/QueryState';
import BackendUnavailableState from '../components/BackendUnavailableState';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Award, Leaf, Truck } from 'lucide-react';
import { isConnectivityError } from '../utils/queryTimeout';
import { useState } from 'react';

export default function HomePage() {
  const { 
    data: siteSettings, 
    isLoading: settingsLoading, 
    error: settingsError,
    refetch: refetchSettings 
  } = useGetSiteSettings();
  
  const { 
    data: sections, 
    isLoading: sectionsLoading, 
    error: sectionsError,
    refetch: refetchSections 
  } = useGetSections();

  const [patternImageError, setPatternImageError] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

  const isLoading = settingsLoading || sectionsLoading;
  const hasError = settingsError || sectionsError;
  const isConnError = hasError && (isConnectivityError(settingsError) || isConnectivityError(sectionsError));

  // Handle loading state
  if (isLoading) {
    return <LoadingState message="Loading content..." />;
  }

  // Handle connectivity error with BackendUnavailableState
  // Only show this for content query failures, not startup failures
  // (startup failures are handled by StartupHealthGate)
  if (isConnError) {
    return (
      <BackendUnavailableState
        onRetry={() => {
          refetchSettings();
          refetchSections();
        }}
      />
    );
  }

  const heroSection = sections?.find((s) => s.title.toLowerCase().includes('hero') || s.title.toLowerCase().includes('welcome'));

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
        {!patternImageError && (
          <div className="absolute inset-0 opacity-5">
            <img
              src="/assets/generated/rice-pattern.dim_1024x1024.png"
              alt=""
              className="w-full h-full object-cover"
              onError={() => setPatternImageError(true)}
            />
          </div>
        )}
        <div className="container relative py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {siteSettings?.siteName || 'M/S Atik Auto Rice Mills'}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                {heroSection?.content || 'Premium quality rice processing with state-of-the-art technology and decades of expertise.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" className="gap-2">
                    View Products <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            {!heroImageError && (
              <div className="relative">
                <img
                  src="/assets/generated/hero-rice-mill.dim_1600x900.png"
                  alt="Rice Mill"
                  className="rounded-lg shadow-2xl w-full"
                  onError={() => setHeroImageError(true)}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine traditional expertise with modern technology to deliver the finest quality rice products.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Rigorous quality control ensures every grain meets our high standards.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Natural Processing</h3>
              <p className="text-muted-foreground">
                We use eco-friendly methods to preserve the natural goodness of rice.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reliable Delivery</h3>
              <p className="text-muted-foreground">
                Timely delivery and efficient logistics for all your rice needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Sections from CMS */}
      {sections && sections.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {sections
                .filter((s) => !s.title.toLowerCase().includes('hero') && !s.title.toLowerCase().includes('welcome'))
                .slice(0, 2)
                .map((section) => (
                  <div key={Number(section.id)} className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Quality?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Get in touch with us today to learn more about our products and services.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="gap-2">
              Contact Us Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
