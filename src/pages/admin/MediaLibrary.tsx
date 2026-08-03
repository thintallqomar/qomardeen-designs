import AdminLayout from '@/components/admin/AdminLayout';
import MediaBrowser from '@/components/admin/MediaBrowser';

const MediaLibrary = () => (
  <AdminLayout>
    <div className="p-4 md:p-10 max-w-6xl">
      <h1 className="text-2xl font-bold mb-1">Media</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Upload once, reuse everywhere. Images are compressed and converted to WebP automatically.
      </p>
      <MediaBrowser />
    </div>
  </AdminLayout>
);

export default MediaLibrary;
