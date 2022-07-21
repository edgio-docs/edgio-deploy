const BUILD_COMPLETE_RE = /^(?:\*|\s)+Deployment Complete[\s\S]+\*$/gim;
const URL_RE = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;

interface IDeployURLs {
  [key: string]: string;
  buildUrl: string;
  permalinkUrl: string;
  edgeUrl: string;
}

export default function getDeployURLs(output: string): IDeployURLs | undefined {
  const deployOutput = BUILD_COMPLETE_RE.exec(output)?.[0];

  if (!deployOutput) return;

  // successful deployments have 3 URLs in the order defined in the interface
  const [buildUrl, permalinkUrl, edgeUrl] = <Array<string>>(
    deployOutput.match(URL_RE)
  );
  return { buildUrl, permalinkUrl, edgeUrl };
}
