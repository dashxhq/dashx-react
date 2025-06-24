import React, { type ChangeEvent } from "react";

import type { StoredPreference } from "./Preferences";

type PreferenceType = [string, StoredPreference];

type RenderPreferenceFunction = (props: {
  preference: PreferenceType;
  onChange: UpdatePreferenceHandler;
}) => React.ReactElement;

interface PreferenceProps {
  preference: PreferenceType;
  onChange: (e: ChangeEvent<HTMLInputElement>, p: PreferenceType) => void;
  renderPreference?: RenderPreferenceFunction;
}

type UpdatePreferenceHandler = (
  event: ChangeEvent<HTMLInputElement>,
  preference: PreferenceType
) => void;

const defaultRenderPreference: RenderPreferenceFunction = ({
  preference,
  onChange,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event, preference);
  };
  return (
    <div>
      <p>{preference[0]}</p>
      <label>
        Email
        <input
          name="email"
          type="checkbox"
          defaultChecked={preference[1].email}
          onChange={handleChange}
        />
      </label>
      <label>
        Push
        <input
          name="push"
          type="checkbox"
          defaultChecked={preference[1].push}
          onChange={handleChange}
        />
      </label>
      <label>
        SMS
        <input
          name="sms"
          type="checkbox"
          defaultChecked={preference[1].sms}
          onChange={handleChange}
        />
      </label>
      <label>
        Whatsapp
        <input
          name="whatsapp"
          type="checkbox"
          defaultChecked={preference[1].whatsapp}
          onChange={handleChange}
        />
      </label>
      <br />
    </div>
  );
};

function Preference({
  preference,
  onChange,
  renderPreference = defaultRenderPreference,
}: PreferenceProps) {
  return renderPreference({ preference, onChange });
}

export default Preference;
