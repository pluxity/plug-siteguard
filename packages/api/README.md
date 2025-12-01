# @plug-siteguard/api

모노레포 전체에서 사용하는 공통 API 클라이언트 패키지입니다.

## 설치

```bash
pnpm add @plug-siteguard/api
```

## 기본 사용법

### 클라이언트 생성

```typescript
import { createApiClient } from '@plug-siteguard/api';

const api = createApiClient({
  baseURL: 'http://dev.pluxity.com/aiot/api',
  refreshTokenURL: '/auth/refresh-token', // 기본값
  onUnauthorized: () => {
    // 401 에러 시 (refresh 실패 후) 호출
    window.location.href = '/login';
  },
});
```

### HTTP 메서드

```typescript
// GET
const users = await api.get<DataResponse<User[]>>('/users');

// POST
const result = await api.post<CreatedResponse>('/users', {
  name: 'John',
  email: 'john@example.com',
});
console.log(result.location); // Location 헤더 (201 응답 시)

// PUT
await api.put('/users/1', { name: 'Jane' });

// PATCH
await api.patch('/users/1', { name: 'Jane' });

// DELETE
await api.delete('/users/1');
```

### 쿼리 파라미터

```typescript
const users = await api.get<DataResponse<User[]>>('/users', {
  params: {
    page: 1,
    size: 10,
    status: 'active',
  },
});
// GET /users?page=1&size=10&status=active
```

## Files API

파일 업로드/조회를 위한 전용 API입니다.

### 파일 업로드

```typescript
// 파일 선택
const fileInput = document.querySelector<HTMLInputElement>('#file');
const file = fileInput?.files?.[0];

if (file) {
  const result = await api.files.upload(file, {
    onProgress: (progress) => {
      console.log(`업로드 진행률: ${progress}%`);
    },
  });

  console.log(result.data.id);       // 파일 ID
  console.log(result.data.url);      // 파일 URL
  console.log(result.location);      // Location 헤더
}
```

### 파일 정보 조회

```typescript
const fileInfo = await api.files.get(123);
console.log(fileInfo.data.originalFileName);
console.log(fileInfo.data.contentType);
```

### Presigned URL 조회

```typescript
const presigned = await api.files.getPresignedUrl(123);
console.log(presigned.data.url); // 서명된 다운로드 URL
```

## 파일 업로드 워크플로우

1. 파일 업로드 → File ID 획득
2. 폼 제출 시 File ID 참조

```typescript
// 1. 파일 업로드
const uploadResult = await api.files.upload(file);
const fileId = uploadResult.data.id;

// 2. 폼 제출 시 fileId 사용
await api.post('/events', {
  title: '이벤트 제목',
  attachmentId: fileId, // 파일 ID 참조
});
```

## 응답 타입

### DataResponse

단일/목록 조회 응답

```typescript
interface DataResponse<T> {
  data: T;
}

// 사용
const user = await api.get<DataResponse<User>>('/users/1');
console.log(user.data.name);
```

### CreatedResponse

생성 요청 응답 (201 Created)

```typescript
interface CreatedResponse<T = number> {
  data: T;
  location: string | null; // Location 헤더
}

// 사용
const result = await api.post<CreatedResponse>('/users', userData);
console.log(result.data);      // 생성된 ID
console.log(result.location);  // /users/123
```

### PageResponse

페이지네이션 응답

```typescript
interface PageResponse<T> {
  data: {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

// 사용
const users = await api.get<PageResponse<User>>('/users', {
  params: { page: 1, size: 10 },
});
console.log(users.data.content);       // User[]
console.log(users.data.totalPages);    // 전체 페이지 수
```

### FileResponse

파일 메타데이터

```typescript
interface FileResponse {
  id: number;
  url: string;
  originalFileName: string;
  contentType: string;
  fileStatus: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
```

## 에러 핸들링

### ApiError

```typescript
import { ApiError, isApiError } from '@plug-siteguard/api';

try {
  await api.get('/protected-resource');
} catch (error) {
  if (isApiError(error)) {
    console.log(error.status);      // HTTP 상태 코드
    console.log(error.code);        // 에러 코드
    console.log(error.message);     // 에러 메시지

    if (error.isNotFound) {
      // 404 처리
    } else if (error.isForbidden) {
      // 403 처리
    } else if (error.isServerError) {
      // 5xx 처리
    }
  }
}
```

### 에러 속성

| 속성 | 타입 | 설명 |
|------|------|------|
| `status` | `number` | HTTP 상태 코드 |
| `code` | `string` | 서버 에러 코드 |
| `message` | `string` | 에러 메시지 |
| `isBadRequest` | `boolean` | 400 여부 |
| `isUnauthorized` | `boolean` | 401 여부 |
| `isForbidden` | `boolean` | 403 여부 |
| `isNotFound` | `boolean` | 404 여부 |
| `isServerError` | `boolean` | 5xx 여부 |

## 인증 처리

### httpOnly 쿠키

모든 요청에 `credentials: 'include'`가 설정되어 httpOnly 쿠키가 자동 전송됩니다.

### 401 자동 처리

1. 401 응답 수신
2. `POST /auth/refresh-token` 자동 호출
3. 성공 시 원래 요청 재시도
4. 실패 시 `onUnauthorized` 콜백 호출

```typescript
const api = createApiClient({
  baseURL: 'http://api.example.com',
  onUnauthorized: () => {
    // refresh token도 만료된 경우
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
});
```

## 파일 구조

```
packages/api/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts      # Export
    ├── client.ts     # API 클라이언트
    ├── files.ts      # Files API
    ├── types.ts      # 타입 정의
    └── error.ts      # ApiError 클래스
```

## API 참조

- [AIoT API Docs](http://dev.pluxity.com/aiot/api/swagger-ui/index.html)
- [Auth API Docs](http://dev.pluxity.com/gs_auth/api/api-docs)
