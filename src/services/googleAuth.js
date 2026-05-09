import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = '319843171517-9dukbbeqcpleufrmce9aiugn1c1g964c.apps.googleusercontent.com';
const REDIRECT_URI = 'https://auth.expo.io/@brunoamaral77/croma-mobile';

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    responseType: 'token',
  });

  return { request, response, promptAsync };
}

export async function logoutGoogle() {
  await WebBrowser.coolDownAsync().catch(() => {});
}