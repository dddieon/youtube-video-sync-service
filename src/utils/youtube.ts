/**
 * 유튜브 링크에서 ID를 추출합니다.
 * 지원하는 링크 형식:
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export function parseYoutubeId(url: string): string | null {
  // 이미 ID 형식인 경우
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // youtu.be 링크
    if (hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }

    // youtube.com 링크
    if (hostname === 'youtube.com' || hostname === 'www.youtube.com') {
      // 일반 영상
      if (urlObj.pathname === '/watch') {
        return urlObj.searchParams.get('v');
      }
      // 쇼츠
      if (urlObj.pathname.startsWith('/shorts/')) {
        return urlObj.pathname.split('/')[2];
      }
      // 임베드
      if (urlObj.pathname.startsWith('/embed/')) {
        return urlObj.pathname.split('/')[2];
      }
    }
  } catch {
    // URL 파싱 실패
    return null;
  }

  return null;
}

/**
 * 클립보드의 텍스트가 유효한 유튜브 ID인지 확인합니다.
 */
export async function isValidYoutubeIdInClipboard(): Promise<boolean> {
  try {
    const text = await navigator.clipboard.readText();
    const id = parseYoutubeId(text);
    return id !== null;
  } catch {
    return false;
  }
}
