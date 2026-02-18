import { useGetContactInfo } from '../hooks/useQueries';
import { LoadingState } from '../components/QueryState';
import BackendUnavailableState from '../components/BackendUnavailableState';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { isConnectivityError } from '../utils/queryTimeout';

export default function ContactPage() {
  const { data: contactInfo, isLoading, error, refetch } = useGetContactInfo();

  if (isLoading) {
    return <LoadingState message="Loading contact information..." />;
  }

  if (error && isConnectivityError(error)) {
    return (
      <div className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">Contact Us</h1>
          <BackendUnavailableState onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with us for inquiries, orders, or any questions you may have.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
              <div className="space-y-4">
                {contactInfo?.address && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Address</h3>
                      <p className="text-muted-foreground">{contactInfo.address}</p>
                    </div>
                  </div>
                )}
                {contactInfo?.phone && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-muted-foreground">{contactInfo.phone}</p>
                    </div>
                  </div>
                )}
                {contactInfo?.email && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-muted-foreground">{contactInfo.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-muted-foreground text-sm">
                Monday - Saturday: 9:00 AM - 6:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
