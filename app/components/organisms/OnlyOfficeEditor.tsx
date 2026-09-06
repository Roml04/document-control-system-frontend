import { useEffect } from "react";

type OnlyOfficeEditorPropType = {
  config: Record<string, unknown>;
};
export default function OnlyOfficeEditor({ config }: OnlyOfficeEditorPropType) {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "http://localhost/web-apps/apps/api/documents/api.js";

    script.onload = () => {
      new (window as any).DocsAPI.DocEditor("placeholder", config);
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [config]);
  return <div id="placeholder" className="w-full h-full" />;
}
