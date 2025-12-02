import type { ApiClient } from './client';
import type { CreatedResponse, DataResponse, FileResponse, UploadOptions } from './types';

/**
 * Presigned URL 응답
 */
export interface PresignedUrlResponse {
  url: string;
}

/**
 * Files API 인터페이스
 */
export interface FilesApi {
  /**
   * 파일 업로드
   * POST /files/upload
   * @returns 201 Created with Location header
   */
  upload: (
    file: File,
    options?: Omit<UploadOptions, 'fieldName'>
  ) => Promise<CreatedResponse<FileResponse>>;

  /**
   * 파일 정보 조회
   * GET /files/{id}
   */
  get: (id: number) => Promise<DataResponse<FileResponse>>;

  /**
   * Presigned URL 조회
   * GET /files/pre-signed-url
   */
  getPresignedUrl: (fileId: number) => Promise<DataResponse<PresignedUrlResponse>>;
}

/**
 * Files API 생성
 */
export function createFilesApi(client: ApiClient): FilesApi {
  return {
    upload: (file, options) => {
      return client.upload<CreatedResponse<FileResponse>>('/files/upload', file, {
        ...options,
        fieldName: 'file',
      });
    },

    get: (id) => {
      return client.get<DataResponse<FileResponse>>(`/files/${id}`);
    },

    getPresignedUrl: (fileId) => {
      return client.get<DataResponse<PresignedUrlResponse>>('/files/pre-signed-url', {
        params: { fileId },
      });
    },
  };
}
