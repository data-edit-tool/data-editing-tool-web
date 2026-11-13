import { atom } from 'recoil';

// 비디오 메타정보 atom

interface IWorkerJobFileVideoState {
  fileId: string;
  fileOrgName: string;
  filePath: string;
  fileUrl: string;
  fileType: string;
}

const workerJobFileVideoAtom = atom<IWorkerJobFileVideoState>({
  key: 'workerJobFileVideoState',
  default: {
    fileId: '',
    fileOrgName: '',
    filePath: '',
    fileUrl: '',
    fileType: '',
  },
});

export { workerJobFileVideoAtom };
