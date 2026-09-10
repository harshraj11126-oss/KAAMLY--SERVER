import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SearchSection } from './components/SearchSection';
import { ServicesGrid } from './components/ServicesGrid';
import { GuaranteeBanner } from './components/GuaranteeBanner';
import { HowItWorks } from './components/HowItWorks';
import { WhyUs } from './components/WhyUs';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { BookingsDrawer } from './components/BookingsDrawer';
import { AuthModal } from './components/AuthModal';
import { ServiceReviewsModal } from './components/ServiceReviewsModal';
import { SERVICES_DATA, TRUSTED_WORKERS } from './data/servicesData';
import { BookingRequest, User, ServiceItem } from './types';

const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'KML-5491',
    serviceName: 'Electrician',
    customerName: 'Harsh Raaj',
    customerPhone: '+91 98765 43210',
    customerLocation: 'Flat 402, Shanti Kunj Apartments, Indiranagar, Bengaluru',
    preferredTime: 'Today - Within 2 Hours',
    message: 'Need ceiling fan regulator and light switch replacement.',
    status: 'Confirmed',
    assignedWorker: TRUSTED_WORKERS[0],
    createdAt: '10:45 AM',
  },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingServiceName, setBookingServiceName] = useState('Electrician');
  const [isBookingsDrawerOpen, setIsBookingsDrawerOpen] = useState(false);
  const [selectedReviewService, setSelectedReviewService] = useState<ServiceItem | null>(null);
  
  // Auth state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('kaamly_current_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // Fallback
    }
    return null;
  });

  // Local storage persisted bookings
  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem('kaamly_bookings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_BOOKINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kaamly_bookings', JSON.stringify(bookings));
    } catch {
      // Ignore storage error
    }
  }, [bookings]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('kaamly_current_user', JSON.stringify(currentUser));
        if (currentUser.location) {
          setSelectedCity(currentUser.location);
        }
      } else {
        localStorage.removeItem('kaamly_current_user');
      }
    } catch {
      // Ignore storage error
    }
  }, [currentUser]);

  // Filtered services
  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SERVICES_DATA.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        service.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCategory) return false;

      if (!q) return true;

      const searchableText = `${service.name} ${service.description} ${service.searchKeywords}`.toLowerCase();
      return searchableText.includes(q);
    });
  }, [searchQuery, selectedCategory]);

  const handleBookService = (serviceName: string) => {
    setBookingServiceName(serviceName);
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
  };

  const handleBookingCreated = (newBooking: BookingRequest) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.location) {
      setSelectedCity(user.location);
    }
    setIsAuthModalOpen(false);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  // Expose legacy global helper functions for full compatibility
  useEffect(() => {
    // @ts-expect-error attaching to window for compatibility
    window.bookService = handleBookService;
    // @ts-expect-error attaching to window for compatibility
    window.closeModal = handleCloseModal;
    // @ts-expect-error attaching to window for compatibility
    window.scrollToServices = scrollToServices;
    // @ts-expect-error attaching to window for compatibility
    window.searchServices = scrollToServices;
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white antialiased">
      {/* Institutional Header with City Selector & Auth */}
      <Header
        onOpenBookings={() => setIsBookingsDrawerOpen(true)}
        bookingsCount={bookings.length}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
      />

      <main className="flex-1">
        {/* Executive Hero Banner with Live Verified Specialist Profile */}
        <Hero
          onExploreClick={scrollToServices}
          onHowItWorksClick={() => scrollToSection('how')}
          selectedCity={selectedCity}
          onQuickBook={handleBookService}
        />

        {/* Live Search & Filter Bar with City Awareness */}
        <SearchSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          resultsCount={filteredServices.length}
          totalCount={SERVICES_DATA.length}
          onSearchSubmit={scrollToServices}
          selectedCity={selectedCity}
        />

        {/* Services Showcase with Standard Rate Cards & Reviews */}
        <ServicesGrid
          services={filteredServices}
          onBookService={handleBookService}
          onResetSearch={handleResetSearch}
          onViewReviews={(service) => setSelectedReviewService(service)}
        />

        {/* The KAAMLY Shield Guarantee Institutional Banner */}
        <GuaranteeBanner />

        {/* Standardized 4-Step Process */}
        <HowItWorks />

        {/* Why KAAMLY Value Props */}
        <WhyUs />

        {/* Contact & 24/7 Helpline Call-To-Action */}
        <ContactSection
          onGetStarted={scrollToServices}
          onRegisterPro={() => handleOpenAuth('register')}
        />
      </main>

      {/* Footer */}
      <Footer
        onServiceClick={handleBookService}
        onNavigate={scrollToSection}
        onSelectCity={setSelectedCity}
      />

      {/* Booking Modal with auto-filled user details */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        defaultService={bookingServiceName}
        onBookingCreated={handleBookingCreated}
        currentUser={currentUser}
        selectedCity={selectedCity}
      />

      {/* My Bookings Drawer */}
      <BookingsDrawer
        isOpen={isBookingsDrawerOpen}
        onClose={() => setIsBookingsDrawerOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onBookNewService={scrollToServices}
      />

      {/* Login & Register Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Interactive Service Details & Verified Reviews Modal */}
      <ServiceReviewsModal
        service={selectedReviewService}
        isOpen={selectedReviewService !== null}
        onClose={() => setSelectedReviewService(null)}
        onBookService={handleBookService}
      />
    </div>
  );
}
