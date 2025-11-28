# 용인 플랫폼 시티

용인시의 플랫폼 관제 시스템 웹 애플리케이션입니다.

## 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript 5.7** - 타입 안전성
- **Vite 6** - 빌드 도구
- **Tailwind CSS v4** - 스타일링
- **@plug-siteguard/ui** - 공유 UI 컴포넌트

## 개발 환경 실행

### 루트에서 실행

```bash
pnpm dev:yongin
```

### 앱 디렉토리에서 실행

```bash
cd apps/yongin-smart-city
pnpm dev
```

개발 서버는 http://localhost:3000 에서 실행됩니다.

## 빌드

```bash
pnpm build
```

## 주요 기능

- 플랫폼시티 관제 대시보드
- 교통, 환경, 안전 관리 정보 표시
- @plug-siteguard/ui 디자인 시스템 활용

## 프로젝트 구조

```
yongin-smart-city/
├── src/
│   ├── App.tsx          # 메인 앱 컴포넌트
│   ├── main.tsx         # 앱 엔트리 포인트
│   ├── index.css        # 글로벌 스타일
│   └── vite-env.d.ts    # Vite 타입 정의
├── index.html           # HTML 템플릿
├── vite.config.ts       # Vite 설정
├── tsconfig.json        # TypeScript 설정
└── package.json         # 패키지 정보
```
