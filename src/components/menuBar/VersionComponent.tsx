import { useApplicationstore } from "@/store/applicationStore";
import { Alert, Button, Divider } from "@heroui/react";
import { isEmpty } from "lodash";
import { Download } from "lucide-react";

export default function VersionComponent() {
  const metadataInformation = useApplicationstore(
    (state) => state.metadataInformation
  );
  const isYtdlpUpdateAvailable = useApplicationstore(
    (state) => state.isYtdlpUpdateAvailable
  );
  const isApplicationUpdateAvailable = useApplicationstore(
    (state) => state.isApplicationUpdateAvailable
  );
  const ytDlpVersion = useApplicationstore((state) => state.ytDlpVersion);

  const appVersion = useApplicationstore((state) => state.appVersion);

  if (!metadataInformation) return null;

  return (
    <div className="grid w-96 h-[60vh] overflow-auto custom-scrollbar">
      <div className="m-2 p-4 shadow-md shadow-black rounded-md">
        <h1 className="text-xl font-bold mb-4">Application Information</h1>
        <h1>Application : {appVersion}</h1>
        <h1>Yt-Dlp : {ytDlpVersion}</h1>

        {isApplicationUpdateAvailable && (
          <div>
            <Alert
              color="danger"
              className="m-2"
            >
              <h1>New version of Application is available</h1>
            </Alert>
            <h1>
              Current :{" "}
              <span className="text-red-600 font-bold">{appVersion}</span>
            </h1>
            <h1>
              Available :{" "}
              <span className="text-green-600 font-bold">
                {metadataInformation.onlineApplicationVersion}
              </span>
            </h1>
            <a
              target="_blank"
              href={metadataInformation.release_url}
            >
              <Button
                className="m-2 flex"
                color="success"
              >
                <Download />
                Download
              </Button>
            </a>
          </div>
        )}
        {!isApplicationUpdateAvailable && (
          <Alert
            color="success"
            className="m-2"
          >
            You are up to date. No new Application Version!
          </Alert>
        )}
      </div>

      {!isYtdlpUpdateAvailable && (
        <div className="p-4">
          <Alert color="success">Yt-dlp is up to date!</Alert>
        </div>
      )}

      {isYtdlpUpdateAvailable && (
        <div className="m-2 p-4 shadow-md shadow-black rounded-md">
          <Alert
            color="danger"
            className="m-2"
          >
            Yt-Dlp new version available
          </Alert>
          <h1 className="text-blue-600"></h1>
          <h1>
            Current :{" "}
            <span className="text-red-600 font-bold">{ytDlpVersion}</span>
          </h1>
          <h1>
            Available :{" "}
            <span className="text-green-600 font-bold">
              {metadataInformation.onlineYtDlpVersion}
            </span>
          </h1>
          <a
            target="_blank"
            href={metadataInformation.ytdlpUrl}
          >
            <Button
              className="m-2"
              color="success"
            >
              Download Yt-Dlp
            </Button>
          </a>
        </div>
      )}

      {/* Features.... */}

      {!isEmpty(metadataInformation.features) && (
        <div className="shadow-md m-2 shadow-black p-2 rounded-md ">
          <h1 className="text-green-600 font-bold text-xl mt-2">
            New Features
          </h1>
          <ul>
            {metadataInformation.features.map((features, index) => (
              <li key={index}>
                <span>{features}</span>

                {index !== metadataInformation.features.length - 1 && (
                  <Divider />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fixed Bugs...... */}
      {!isEmpty(metadataInformation.fixed_errors) && (
        <div className="shadow-md m-2 shadow-black p-2 rounded-md mt-2">
          <h1 className="text-green-600 font-bold text-xl">Fixed Errors</h1>
          <ul>
            {metadataInformation.fixed_errors.map((error, index) => (
              <li key={index}>
                <span>{error}</span>
                {index !== metadataInformation.fixed_errors.length - 1 && (
                  <Divider />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
