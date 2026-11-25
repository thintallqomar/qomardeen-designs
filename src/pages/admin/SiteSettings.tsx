import AdminLayout from '@/components/admin/AdminLayout';
import SiteSettingsPanel from '@/components/admin/SiteSettingsPanel';

const SiteSettings = () => (
  <AdminLayout>
    <div className="p-4 md:p-10 max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">Site</h1>
      <p className="text-sm text-muted-foreground mb-8">
        The Home hero, Atlas, your hero photos and your CV. Changes go live for visitors within a few minutes.
      </p>
      <SiteSettingsPanel />
    </div>
  </AdminLayout>
);

export default SiteSettings;
