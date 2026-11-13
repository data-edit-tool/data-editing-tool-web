import { atom } from 'recoil';

// file 정보 atom

interface IWorkerJobFileAudioState {
  fileId: string;
  fileOrgName: string;
  filePath: string;
  fileUrl: string;
  fileType: string;
}

const workerJobFileAudioAtom = atom<IWorkerJobFileAudioState>({
  key: 'workerJobFileAudioState',
  default: {
    fileId: '',
    fileOrgName: '',
    filePath: '',
    fileUrl: '',
    fileType: '',
  },
});

export { workerJobFileAudioAtom };
