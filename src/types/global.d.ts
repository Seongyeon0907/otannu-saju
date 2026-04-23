interface KakaoShareContent {
  title: string;
  description: string;
  imageUrl: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

interface KakaoShareButton {
  title: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

interface KakaoShareParams {
  objectType: string;
  content: KakaoShareContent;
  buttons?: KakaoShareButton[];
}

interface Window {
  Kakao?: {
    init: (key: string) => void;
    isInitialized: () => boolean;
    Share: {
      sendDefault: (params: KakaoShareParams) => void;
    };
  };
}
