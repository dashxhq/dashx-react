import React, { ChangeEvent } from "react";

import Preference from "./Preference";
import useDashXProvider from "../hooks/use-dashx-provider";

interface StoredPreference {
  enabled?: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
}

interface PreferencesProps {
  renderPreferences: ({
    preferences,
    onChange,
    loading,
    error,
  }: {
    preferences: [string, StoredPreference][] | null;
    onChange: (
      e: ChangeEvent<HTMLInputElement>,
      p: [string, StoredPreference]
    ) => void;
    loading: boolean;
    error: any;
  }) => React.ReactElement;
}

const defaultRenderPreferences: PreferencesProps["renderPreferences"] = ({
  preferences,
  onChange,
  loading,
}) => {
  if (preferences)
    return (
      <>
        {preferences.map((preference) => (
          <Preference
            key={preference[0]}
            preference={preference}
            onChange={onChange}
          />
        ))}
      </>
    );
  if (loading) return <>Loading...</>;
  return <>An unexpected error ocurred</>;
};

function Preferences({
  renderPreferences = defaultRenderPreferences,
}: PreferencesProps) {
  const dashX = useDashXProvider();
  const [preferences, setPreferences] = React.useState<{
    [key: string]: StoredPreference;
  } | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<any>(null);
  const [dirty, setDirty] = React.useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    preference: [string, StoredPreference]
  ) => {
    setDirty(true);
    const [key, values] = preference;

    setPreferences((prefs) => ({
      ...(prefs || {}),
      [key]: {
        ...values,
        [event.target.name]: event.target.checked,
      },
    }));
  };

  React.useEffect(() => {
    if (!dirty) return;
    // Use some kind of debounce
    const timeoutId = setTimeout(async () => {
      await dashX.saveStoredPreferences(preferences);
      setDirty(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [preferences, dirty, dashX]);

  React.useEffect(() => {
    async function fetchPreferences() {
      setLoading(true);
      try {
        const preferences = await dashX.fetchStoredPreferences();
        setPreferences(preferences);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPreferences();
  }, [dashX]);

  return renderPreferences({
    preferences:
      preferences &&
      Object.entries(preferences).map(([key, value]: any) => [key, value]),
    onChange: handleChange,
    loading,
    error,
  });
}

export default Preferences;

export type { StoredPreference };
