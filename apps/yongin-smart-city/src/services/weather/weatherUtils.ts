export const getWindDirection = (deg: number): string => {
  const directions = [
    '북', '북북동', '북동', '동북동', 
    '동', '동남동', '남동', '남남동', 
    '남', '남남서', '남서', '서남서', 
    '서', '서북서', '북서', '북북서'
  ];
  const index = Math.round(deg / 22.5) % 16;
  return `${directions[index]}풍`;
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
};

export const getWeatherIconName = (weatherId: number): string => {
  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm-rain';
  if (weatherId >= 300 && weatherId < 400) return 'rainy';
  if (weatherId >= 500 && weatherId < 600) return 'rainy';
  if (weatherId >= 600 && weatherId < 700) return 'snow';
  if (weatherId >= 700 && weatherId < 800) return 'mist';
  if (weatherId === 800) return 'sunny';
  if (weatherId >= 801 && weatherId <= 804) {
    return weatherId === 801 ? 'partly-cloudy' : 'cloudy';
  }
  
  return 'sunny';
};

export const weatherIdMap: Record<number, string> = {
  200: "천둥 약한 비",
  201: "천둥 비",
  202: "천둥 강한 비",
  210: "약한 천둥",
  211: "천둥",
  212: "강한 천둥",
  221: "불규칙한 천둥",
  230: "천둥 약한 이슬비",
  231: "천둥 이슬비",
  232: "천둥 강한 이슬비",
  
  300: "약한 이슬비",
  301: "이슬비",
  302: "강한 이슬비",
  310: "약한 이슬비",
  311: "이슬비",
  312: "강한 이슬비",
  313: "소나기 이슬비",
  314: "강한 소나기 이슬비",
  321: "소나기 이슬비",
  
  500: "약한 비",
  501: "비",
  502: "강한 비",
  503: "매우 강한 비",
  504: "극심한 비",
  511: "우박",
  520: "약한 소나기",
  521: "소나기",
  522: "강한 소나기",
  531: "불규칙한 소나기",
  
  600: "약한 눈",
  601: "눈",
  602: "폭설",
  611: "진눈깨비",
  612: "약한 진눈깨비",
  613: "진눈깨비",
  615: "약한 비 눈",
  616: "비 눈",
  620: "약한 소나기 눈",
  621: "소나기 눈",
  622: "강한 소나기 눈",
  
  701: "안개",
  711: "연기",
  721: "연무",
  731: "모래/먼지 회오리",
  741: "안개",
  751: "모래",
  761: "먼지",
  762: "화산재",
  771: "돌풍",
  781: "토네이도",
  
  800: "맑음",
  801: "구름 조금",
  802: "구름 많음",
  803: "흐림",
  804: "매우 흐림",
};

export const getWeatherDescription = (weatherId: number, description: string): string => {
  return weatherIdMap[weatherId] || description;
};

