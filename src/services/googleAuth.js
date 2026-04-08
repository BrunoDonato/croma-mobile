import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '319843171517-9dukbbeqcpleufrmce9aiugn1c1g964c.apps.googleusercontent.com',
});

export async function loginComGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const { idToken } = await GoogleSignin.getTokens();
    return idToken;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Login cancelado.');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('Login já em andamento.');
    } else {
      throw new Error('Erro ao fazer login com Google.');
    }
  }
}

export async function logoutGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch {
  }
}