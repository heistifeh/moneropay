
import { supabaseBrowser } from "../supabaseAdmin";


export async function verifyOtp(email: string, otp: string) {
  const supabase = supabaseBrowser();

  const isPasswordReset = sessionStorage.getItem('isPasswordReset') == 'true';

  const { data, error } = await supabase.auth.verifyOtp({
    token: otp,
    email,
    type: isPasswordReset ? 'recovery' : 'email',
  });

  if (error) throw error;

  return data;
}

export async function login(email: string, password: string) {
  const supabase = supabaseBrowser();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function logout() {
  const supabase = supabaseBrowser();

  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function updatePassword(password: string) {
  const supabase = supabaseBrowser();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;
}