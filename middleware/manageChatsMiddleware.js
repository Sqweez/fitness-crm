import { canManageChats } from '@/utils/chats';

export default function ({ $auth, $toast, redirect }) {
  if (!canManageChats($auth.user)) {
    $toast.error('Доступ запрещен!');
    return redirect('/');
  }
}
