// Enhanced Clerk theme configuration for Prime Interviews
export const clerkTheme = {
  layout: {
    socialButtonsVariant: 'blockButton',
    socialButtonsPlacement: 'top',
    showOptionalFields: true,
    logoImageUrl: undefined, // Add your logo URL here
    logoPlacement: 'none',
  },
  variables: {
    colorPrimary: '#3b82f6',
    colorDanger: '#ef4444',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorNeutral: '#64748b',
    colorText: '#1e293b',
    colorTextSecondary: '#64748b',
    colorTextOnPrimaryBackground: '#ffffff',
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#1e293b',
    borderRadius: '0.75rem',
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    spacingUnit: '1rem',
  },
  elements: {
    // Root container
    rootBox: {
      width: '100%',
    },

    // Card container
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      padding: '2rem',
      backdropFilter: 'blur(10px)',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    },

    // Header
    headerTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },

    headerSubtitle: {
      fontSize: '0.875rem',
      color: '#64748b',
      fontWeight: '400',
    },

    // Form elements
    formFieldInput: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(4px)',
      border: '1px solid #d1d5db',
      borderRadius: '0.75rem',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '&:focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        backgroundColor: '#ffffff',
        outline: 'none',
      },
      '&:hover': {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },

    formFieldLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem',
    },

    // Primary button
    formButtonPrimary: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: '#ffffff',
      borderRadius: '0.75rem',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '&:hover': {
        background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
        transform: 'translateY(-1px)',
        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
      '&:disabled': {
        opacity: '0.6',
        cursor: 'not-allowed',
        transform: 'none',
      },
    },

    // Secondary button
    formButtonSecondary: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: '0.75rem',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
        borderColor: '#9ca3af',
      },
    },

    // Social buttons
    socialButtonsBlockButton: {
      background: '#ffffff',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '&:hover': {
        borderColor: '#3b82f6',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f8fafc',
      },
    },

    // Links
    footerActionLink: {
      color: '#3b82f6',
      fontSize: '0.875rem',
      fontWeight: '500',
      textDecoration: 'none',
      '&:hover': {
        color: '#1d4ed8',
        textDecoration: 'underline',
      },
    },

    // Divider
    dividerLine: {
      backgroundColor: '#e5e7eb',
      height: '1px',
    },

    dividerText: {
      color: '#6b7280',
      fontSize: '0.75rem',
      fontWeight: '500',
      backgroundColor: '#ffffff',
      padding: '0 1rem',
    },

    // Error messages
    formFieldErrorText: {
      color: '#ef4444',
      fontSize: '0.75rem',
      fontWeight: '500',
      marginTop: '0.25rem',
    },

    // Success messages
    formFieldSuccessText: {
      color: '#10b981',
      fontSize: '0.75rem',
      fontWeight: '500',
      marginTop: '0.25rem',
    },

    // Loading spinner
    spinner: {
      color: '#3b82f6',
      width: '1.25rem',
      height: '1.25rem',
    },

    // Modal backdrop
    modalBackdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
    },

    // Alternative methods
    alternativeMethodsBlockButton: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: '#3b82f6',
        backgroundColor: '#f0f9ff',
        color: '#1e40af',
      },
    },
  },
}

// Responsive variations for mobile
export const clerkMobileTheme = {
  ...clerkTheme,
  elements: {
    ...clerkTheme.elements,
    card: {
      ...clerkTheme.elements.card,
      padding: '1.5rem',
      margin: '1rem',
      borderRadius: '1rem',
    },
    headerTitle: {
      ...clerkTheme.elements.headerTitle,
      fontSize: '1.5rem',
    },
  },
}