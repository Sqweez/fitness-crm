import {openInNewTab} from '@/utils/helpers';

export function openInWhatsapp (phone) {
  let clonedPhone = phone;
  if (phone.startsWith('+')) {
    clonedPhone = phone.substring(1);
  }
  const link = `https://api.WhatsApp.com/send?phone=${clonedPhone}`
  return openInNewTab(link);
}
