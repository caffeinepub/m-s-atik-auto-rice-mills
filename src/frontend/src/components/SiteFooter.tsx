import { Link } from '@tanstack/react-router';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useGetContactInfo, useGetSiteSettings } from '../hooks/useQueries';
import BackendUnavailableState from './BackendUnavailableState';
import BuildVersionLabel from './BuildVersionLabel';
import { isConnectivityError } from '../utils/queryTimeout';

export default function SiteFooter() {
  const { data: contactInfo, error: contactError, refetch: refetchContact } = useGetContactInfo();
  const { data: siteSettings, error: settingsError, refetch: refetchSettings } = useGetSiteSettings();
  const currentYear = new Date().getFullYear();

  // Check if we have connectivity errors
  const hasConnectivityError = 
    (contactError && isConnectivityError(contactError)) || 
    (settingsError && isConnectivityError(settingsError));

  // Use fallback values if queries fail
  const siteName = siteSettings?.siteName || 'M/S Atik Auto Rice Mills';
  const hasContactInfo = contactInfo && !contactError;

  // Generate app identifier for UTM tracking
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'atik-rice-mills'
  );

  // If we have connectivity errors, show compact error state
  if (hasConnectivityError) {
    return (
      <footer className="border-t bg-muted/30">
        <div className="container py-8">
          <BackendUnavailableState
            compact
            onRetry={() => {
              refetchContact();
              refetchSettings();
            }}
          />
          <div className="mt-6 pt-6 border-t space-y-3">
            <div className="flex justify-center">
              <BuildVersionLabel />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>
                © {currentYear} {siteName}. Built with{' '}
                <Heart className="inline h-3 w-3 text-red-500 fill-red-500" /> using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">{siteName}</h3>
            <p className="text-sm text-muted-foreground">
              Quality rice processing with modern technology and traditional values.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Products
              </Link>
              <Link to="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            {hasContactInfo ? (
              <div className="space-y-2 text-sm text-muted-foreground">
                {contactInfo.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{contactInfo.address}</span>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{contactInfo.phone}</span>
                  </div>
                )}
                {contactInfo.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>{contactInfo.email}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Contact information will be available soon.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t space-y-3">
          <div className="flex justify-center">
            <BuildVersionLabel />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {currentYear} {siteName}. All rights reserved. Built with{' '}
              <Heart className="inline h-3 w-3 text-red-500 fill-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
