import { canManageTrainers } from '@/utils/trainers';

export default function ({ $auth, $toast, redirect }) {
  if (!$auth.user || !canManageTrainers($auth.user)) {
    $toast.error('Доступ запрещен!');
    return redirect('/');
  }
}
