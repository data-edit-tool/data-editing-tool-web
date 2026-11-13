import { styled } from 'styled-components';

const LoadingWrapper = styled.div`
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  & > div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${({ theme }) => theme.workerColor.white};
      font-size: ${({ theme }) => theme.fontSize.text_20};
      font-weight: 500;
    }
    .lds-ring {
      display: inline-block;
      position: relative;
      width: 200px;
      height: 200px;
    }
    .lds-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 180px;
      height: 180px;
      margin: 8px;
      border: 8px solid #fff;
      border-radius: 50%;
      animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: #fff transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
      animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
      animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
      animation-delay: -0.15s;
    }
    @keyframes lds-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;

const Loading = () => {
  return (
    <LoadingWrapper>
      <div>
        <div className="lds-ring">
          <div />
          <div />
          <div />
          <div />
        </div>
        <span className="text">LOADING</span>
      </div>
    </LoadingWrapper>
  );
};

export default Loading;
