import { useGetSiteSettings } from '../hooks/useQueries';

interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = 'h-12 w-12' }: BrandLogoProps) {
  const { data: siteSettings } = useGetSiteSettings();

  const logoSrc = siteSettings?.logoUrl && siteSettings.logoUrl !== '/logo.png' 
    ? siteSettings.logoUrl 
    : '/assets/generated/atik-logo.dim_512x512.png';

  return (
    <img
      src={logoSrc}
      alt="M/S Atik Auto Rice Mills Logo"
      className={className}
      onError={(e) => {
        e.currentTarget.src = '/assets/generated/atik-logo.dim_512x512.png';
      }}
    />
  );
}
