import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface CompanyBranding {
  id?: string;
  company_id: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  custom_domain?: string;
  domain_verified: boolean;
  email_header_logo?: string;
  email_footer_text?: string;
  custom_css?: string;
  features: Record<string, any>;
}

export const CompanyBranding: React.FC = () => {
  const [branding, setBranding] = useState<CompanyBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyBranding>>({});

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      const response = await fetch('/api/v1/admin/branding', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBranding(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching branding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/v1/admin/branding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedBranding = await response.json();
        setBranding(updatedBranding);
        setFormData(updatedBranding);
      }
    } catch (error) {
      console.error('Error saving branding:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!formData.custom_domain) return;

    setVerifyingDomain(true);
    try {
      const response = await fetch('/api/v1/admin/branding/verify-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ domain: formData.custom_domain })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.verified) {
          await fetchBranding(); // Refresh to get updated verification status
        }
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
    } finally {
      setVerifyingDomain(false);
    }
  };

  const handleInputChange = (field: keyof CompanyBranding, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading branding settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Company Branding</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Logo and Visual Identity */}
        <Card>
          <CardHeader>
            <CardTitle>Visual Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <Input
                value={formData.logo_url || ''}
                onChange={(e) => handleInputChange('logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Favicon URL</label>
              <Input
                value={formData.favicon_url || ''}
                onChange={(e) => handleInputChange('favicon_url', e.target.value)}
                placeholder="https://example.com/favicon.ico"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Primary Color</label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={formData.primary_color || '#3B82F6'}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.primary_color || '#3B82F6'}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Secondary Color</label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={formData.secondary_color || '#64748B'}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.secondary_color || '#64748B'}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    placeholder="#64748B"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Accent Color</label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={formData.accent_color || '#10B981'}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.accent_color || '#10B981'}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    placeholder="#10B981"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Domain */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Domain</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Custom Domain</label>
              <div className="flex space-x-2">
                <Input
                  value={formData.custom_domain || ''}
                  onChange={(e) => handleInputChange('custom_domain', e.target.value)}
                  placeholder="hiring.yourcompany.com"
                />
                <Button
                  variant="outline"
                  onClick={handleVerifyDomain}
                  disabled={!formData.custom_domain || verifyingDomain}
                >
                  {verifyingDomain ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
              {branding?.domain_verified && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Domain verified
                </p>
              )}
              {formData.custom_domain && !branding?.domain_verified && (
                <p className="text-sm text-orange-600 mt-1">
                  Domain not verified. Please verify to enable custom domain.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Email Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Header Logo URL</label>
              <Input
                value={formData.email_header_logo || ''}
                onChange={(e) => handleInputChange('email_header_logo', e.target.value)}
                placeholder="https://example.com/email-logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Footer Text</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={formData.email_footer_text || ''}
                onChange={(e) => handleInputChange('email_footer_text', e.target.value)}
                placeholder="© 2024 Your Company. All rights reserved."
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom CSS */}
        <Card>
          <CardHeader>
            <CardTitle>Custom CSS</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium mb-1">Custom CSS</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
                rows={10}
                value={formData.custom_css || ''}
                onChange={(e) => handleInputChange('custom_css', e.target.value)}
                placeholder="/* Add your custom CSS here */
.custom-button {
  background-color: var(--primary-color);
  border-radius: 8px;
}"
              />
              <p className="text-sm text-gray-600 mt-1">
                Use CSS variables: --primary-color, --secondary-color, --accent-color
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="p-6 border rounded-lg"
              style={{
                backgroundColor: formData.primary_color || '#3B82F6',
                color: 'white'
              }}
            >
              <div className="flex items-center space-x-4">
                {formData.logo_url && (
                  <img 
                    src={formData.logo_url} 
                    alt="Logo" 
                    className="h-8 w-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">Your Company</h3>
                  <p className="text-sm opacity-90">Recruitment Platform</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button 
                  className="px-4 py-2 rounded"
                  style={{ backgroundColor: formData.accent_color || '#10B981' }}
                >
                  Primary Action
                </button>
                <button 
                  className="px-4 py-2 rounded border border-white/20"
                  style={{ backgroundColor: formData.secondary_color || '#64748B' }}
                >
                  Secondary Action
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};