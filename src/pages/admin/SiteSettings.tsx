import AdminLayout from '@/components/admin/AdminLayout';
import SiteSettingsPanel from '@/components/admin/SiteSettingsPanel';

const SiteSettings = () => (
  <AdminLayout>
    <div className="p-4 md:p-10 max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">Site</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Your hero images and your CV. Upload a new file and the site uses it; use "Use built-in" to go back to the original.
      </p>
      <SiteSettingsPanel />
    </div>
  </AdminLayout>
);

export default SiteSettings;
