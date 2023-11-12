export default function ({ store, redirect, $auth, $toast }) {
  const IS_BOSS = $auth.user && $auth.user.is_boss;
  if (!IS_BOSS) {
    $toast.error('Доступ запрещен!');
    redirect('/');
  }
}
