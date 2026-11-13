// 영상의 시간을 받아서 HH:MM:SS.SSS 형태로 변환합니다.
export const formatTime = (time: number) => {
  const date = new Date(time);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const milliseconds = date.getUTCMilliseconds();

  // 시간은 HH:MM:SS.SSS 형태로 변환합니다.
  // padStart를 사용해서 한자리 숫자는 앞에 0을 붙여서 두자리로 만듭니다.
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds
    .toString()
    .padStart(3, '0')}`;
};
