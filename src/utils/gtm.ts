// Google Tag Manager event utilities

// Declare global dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// Initialize dataLayer if it doesn't exist
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

// Push events to GTM dataLayer
export const pushToDataLayer = (data: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

// Track page views (for SPAs)
export const trackPageView = (path: string) => {
  pushToDataLayer({
    event: 'page_view',
    page_path: path,
  });
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  pushToDataLayer({
    event: eventName,
    ...parameters,
  });
};

// Specific tracking functions
export const trackContactFormSubmit = (formData: { name: string; email: string; message: string }) => {
  trackEvent('contact_form_submit', {
    event_category: 'engagement',
    event_label: 'contact_form',
    form_name: formData.name,
    form_email: formData.email,
  });
};

export const trackGalleryView = (galleryId: string, galleryTitle: string) => {
  trackEvent('gallery_view', {
    event_category: 'engagement',
    event_label: 'gallery',
    gallery_id: galleryId,
    gallery_title: galleryTitle,
  });
};

export const trackImageView = (imageTitle: string, galleryTitle: string) => {
  trackEvent('image_view', {
    event_category: 'engagement',
    event_label: 'gallery_image',
    image_title: imageTitle,
    gallery_title: galleryTitle,
  });
};

export const trackArtistLinkClick = (artistName: string, linkUrl: string) => {
  trackEvent('artist_link_click', {
    event_category: 'outbound',
    event_label: 'artist_link',
    artist_name: artistName,
    link_url: linkUrl,
  });
};

export const trackCarouselInteraction = (action: 'swipe' | 'click' | 'autoplay', slideIndex: number) => {
  trackEvent('carousel_interaction', {
    event_category: 'engagement',
    event_label: 'carousel',
    interaction_type: action,
    slide_index: slideIndex,
  });
};

export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll_depth', {
    event_category: 'engagement',
    event_label: 'scroll',
    scroll_percentage: percentage,
  });
};