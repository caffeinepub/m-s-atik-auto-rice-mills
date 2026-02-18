import { Badge } from '@/components/ui/badge';
import { getBuildVersion } from '../utils/buildInfo';
import { getReleaseChannel } from '../utils/releaseChannel';

interface BuildVersionLabelProps {
  className?: string;
}

export default function BuildVersionLabel({ className = '' }: BuildVersionLabelProps) {
  const version = getBuildVersion();
  const releaseInfo = getReleaseChannel();
  const isPreview = releaseInfo.channel === 'preview';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="outline" className="text-xs font-mono">
        {version}
      </Badge>
      {isPreview && (
        <Badge variant="secondary" className="text-xs">
          Preview
        </Badge>
      )}
    </div>
  );
}
