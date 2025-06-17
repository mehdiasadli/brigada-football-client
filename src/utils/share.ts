import { notifications, type NotificationData } from '@mantine/notifications';

export function handleCopy(url: string, notificationOptions?: Partial<NotificationData>) {
  navigator.clipboard.writeText(url);

  notifications.show({
    title: 'Link copied!',
    message: 'Link copied to clipboard',
    color: 'green',
    autoClose: 2000,
    ...notificationOptions,
  });
}

export function handleShare(
  platform: string,
  data: {
    path: string;
    text?: string;
  }
) {
  const url = `${window.location.origin}${data.path}`;
  const text = data.text || 'Check out this resource in Brigada Football';

  let shareUrl = '';

  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
      break;
  }

  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
}

export function handlePostShare(platform: string, id: string, name: string) {
  return handleShare(platform, {
    path: `posts/c/${id}`,
    text: `Check out this post by ${name}`,
  });
}
