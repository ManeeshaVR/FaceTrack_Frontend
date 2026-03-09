import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Card, CardContent, Input, Button, Switch } from "../../components/ui";
import { Save } from "lucide-react";
import { apiFetch } from "../../utils/api";

export default function Settings() {
  const [settings, setSettings] = useState({
    instituteName: "",
    instituteEmail: "",
    institutePhone: "",
    instituteAddress: "",
    emailNotifications: true,
    smsNotifications: false,
    livenessDetection: true,
    autoBackup: true,
    sessionTimeout: "30",
    maxStudentsPerClass: "35",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiFetch("/settings");
      if (response.data) {
        setSettings(response.data);
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiFetch("/settings", {
        method: "POST",
        body: JSON.stringify(settings),
      });
      toast.success("Settings saved successfully!");
    } catch (e) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage system settings and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Institute Information */}
        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Institute Information</h2>
          </div>
          <CardContent className="p-6 space-y-4">
            <Input
              label="Institute Name"
              value={settings.instituteName}
              onChange={(e) => setSettings({ ...settings, instituteName: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={settings.instituteEmail}
              onChange={(e) => setSettings({ ...settings, instituteEmail: e.target.value })}
            />
            <Input
              label="Phone"
              type="tel"
              value={settings.institutePhone}
              onChange={(e) => setSettings({ ...settings, institutePhone: e.target.value })}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={settings.instituteAddress}
                onChange={(e) => setSettings({ ...settings, instituteAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <CardContent className="p-6 space-y-4">
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              label="Email Notifications"
            />
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
              label="SMS Notifications"
            />
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">System Configuration</h2>
          </div>
          <CardContent className="p-6 space-y-4">
            <Switch
              checked={settings.livenessDetection}
              onCheckedChange={(checked) => setSettings({ ...settings, livenessDetection: checked })}
              label="Face Liveness Detection"
            />
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
              label="Automatic Backup"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Session Timeout (minutes)"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
              />
              <Input
                label="Max Students Per Class"
                type="number"
                value={settings.maxStudentsPerClass}
                onChange={(e) => setSettings({ ...settings, maxStudentsPerClass: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" icon={Save} size="lg" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
