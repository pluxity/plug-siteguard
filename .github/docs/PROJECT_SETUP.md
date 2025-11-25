# plug-siteguard GitHub Project 설정 가이드

## 📋 프로젝트 정보

- **Organization**: pluxity
- **Repository**: plug-siteguard
- **프로젝트명**: plug-siteguard
- **설명**: 용인 스마트시티를 위한 디자인시스템 및 애플리케이션 개발

---

## 🎯 Milestone 생성 (4개)

GitHub 웹사이트에서 수동으로 생성해주세요:
https://github.com/pluxity/plug-siteguard/milestones/new

### 1. 🎨 Design System v1.0
- **Due Date**: 2024-11-30
- **Description**:
  ```
  기본 UI 컴포넌트 라이브러리 구축
  - Atoms (Button, Input, Badge, Label, Avatar, etc.)
  - Molecules (Card, Alert, Tabs, Tooltip, etc.)
  - Organisms (Dialog, Form, DataTable, etc.)
  - Storybook 문서화 완료
  ```

### 2. 🏙️ Yongin Prototype
- **Due Date**: 2024-12-10
- **Description**:
  ```
  용인 스마트시티 프로토타입 개발
  - 프로젝트 셋업 (apps/yongin-smart-city)
  - 기본 레이아웃 및 라우팅
  - 핵심 화면 3-4개 (목업 수준)
  - 디자인시스템 컴포넌트 조립
  - 데모 가능한 프로토타입 완성
  ```

### 3. 🏙️ Yongin Beta
- **Due Date**: 2024-12-31
- **Description**:
  ```
  용인 스마트시티 베타 버전
  - API 연동 완료
  - 핵심 기능 구현
  - 디자인시스템 개선 (실사용 피드백 반영)
  - 버그 수정 및 안정화
  - 내부 테스트 가능한 베타 버전
  ```

### 4. 🏙️ Yongin v1.0 Release
- **Due Date**: 2025-03-31
- **Description**:
  ```
  용인 스마트시티 정식 릴리즈
  - 전체 기능 완성
  - 성능 최적화
  - E2E 테스트 완료
  - 문서화 완료
  - 프로덕션 배포 준비
  ```

---

## 🗂️ GitHub Project 생성

### Project 기본 설정

1. **프로젝트 생성**:
   - https://github.com/orgs/pluxity/projects/new
   - Template: Board
   - Project name: `plug-siteguard`
   - Description: `용인 스마트시티를 위한 디자인시스템 및 애플리케이션 통합 관리`

2. **Repository 연결**:
   - Settings → Linked repositories
   - `pluxity/plug-siteguard` 추가

---

## ⚙️ Project 필드 설정

### 기본 필드 (GitHub 제공)
- ✅ **Status**: Todo, In Progress, In Review, Done
- ✅ **Assignees**: 담당자

### 추가 필드 (수동 생성 필요)

#### 1. Milestone (Single select)
```
Options:
- 🎨 Design System v1.0
- 🏙️ Yongin Prototype
- 🏙️ Yongin Beta
- 🏙️ Yongin v1.0 Release
```

#### 2. Component (Single select)
```
Options:
- 🎨 Design System (UI)
- 🏙️ Yongin App
- 📦 Shared (types, api-hooks)
- 🏗️ Infrastructure (build, deploy)
```

#### 3. Priority (Single select)
```
Options:
- 🔴 Critical
- 🟠 High
- 🟡 Medium
- 🟢 Low
```

#### 4. Sprint (Single select)
```
Options:
- Sprint 1 (11/18-11/29)
- Sprint 2 (12/02-12/13)
- Sprint 3 (12/16-12/27)
- Sprint 4 (12/30-01/10)
- Sprint 5 (01/13-01/24)
- Sprint 6 (01/27-02/07)
- Sprint 7 (02/10-02/21)
- Sprint 8 (02/24-03/07)
- Sprint 9 (03/10-03/21)
- Sprint 10 (03/24-03/31)
```

#### 5. Release Phase (Single select)
```
Options:
- 🏗️ Foundation (디자인시스템)
- 🚀 Prototype
- 🧪 Beta
- ✅ Production
```

#### 6. Start Date (Date)
- YYYY-MM-DD 형식

#### 7. Due Date (Date)
- YYYY-MM-DD 형식

---

## 📊 Project Views 생성

### View 1: 전체 보드 (Board)
- **이름**: All Tasks
- **그룹핑**: Status
- **정렬**: Priority (High → Low)
- **필터**: 없음

### View 2: 현재 스프린트 (Board)
- **이름**: Current Sprint
- **그룹핑**: Status
- **정렬**: Priority
- **필터**: Sprint = "Sprint 1" (현재 스프린트로 업데이트)

### View 3: 디자인시스템 (Board)
- **이름**: Design System
- **그룹핑**: Status
- **정렬**: Priority
- **필터**: Component = "🎨 Design System (UI)"

### View 4: 용인 앱 (Board)
- **이름**: Yongin App
- **그룹핑**: Milestone
- **정렬**: Priority
- **필터**: Component = "🏙️ Yongin App"

### View 5: 타임라인 (Roadmap)
- **이름**: Roadmap
- **X축**: Due Date
- **그룹핑**: Milestone
- **필터**: 없음

### View 6: 마일스톤별 진행상황 (Table)
- **이름**: Milestone Progress
- **표시 필드**: Title, Milestone, Status, Component, Priority, Assignees, Due Date
- **그룹핑**: Milestone
- **정렬**: Due Date

---

## 🏷️ Labels 생성

Repository Settings → Labels에서 생성:

### 타입
- `feature` - 새로운 기능
- `bug` - 버그 수정
- `enhancement` - 기능 개선
- `documentation` - 문서화
- `refactor` - 리팩토링

### 컴포넌트
- `design-system` - 디자인시스템 관련
- `yongin-app` - 용인 앱 관련
- `shared` - 공유 패키지

### 우선순위
- `critical` - 치명적 (빨강)
- `high-priority` - 높음 (주황)
- `medium-priority` - 보통 (노랑)
- `low-priority` - 낮음 (초록)

### 상태
- `blocked` - 차단됨
- `needs-review` - 리뷰 필요
- `needs-design` - 디자인 필요
- `ready` - 작업 준비 완료

---

## 📝 Issue Templates

`.github/ISSUE_TEMPLATE/` 디렉토리에 생성:

### feature.md
```yaml
---
name: Feature Request
about: 새로운 기능 제안
title: "[FEATURE] "
labels: feature
assignees: ''
---

## 개요
[기능에 대한 간단한 설명]

## 배경
[왜 이 기능이 필요한가?]

## 주요 기능
- [ ] 기능 1
- [ ] 기능 2

## 기술 요구사항
- 사용할 기술 스택
- 필요한 라이브러리

## 참고 자료
- 관련 문서 링크
```

### bug.md
```yaml
---
name: Bug Report
about: 버그 제보
title: "[BUG] "
labels: bug, high-priority
assignees: ''
---

## 버그 설명
[버그에 대한 명확한 설명]

## 재현 방법
1. [단계 1]
2. [단계 2]

## 예상 동작
[예상되는 동작]

## 실제 동작
[실제로 발생하는 동작]

## 환경
- OS:
- Browser:
- Version:

## 스크린샷
[해당되는 경우 스크린샷 첨부]
```

---

## 🚀 Sprint 계획

### Sprint 1-2: 디자인시스템 구축 (11/18 ~ 11/29)
- Milestone: 🎨 Design System v1.0
- Component: Design System (UI)
- 목표: Atoms, Molecules 완성

### Sprint 3: 프로토타입 준비 (12/02 ~ 12/13)
- Milestone: 🏙️ Yongin Prototype
- Component: Yongin App
- 목표: 프로젝트 셋업 및 레이아웃

### Sprint 4-5: 베타 개발 (12/16 ~ 01/24)
- Milestone: 🏙️ Yongin Beta
- Component: Yongin App + Design System
- 목표: API 연동 및 핵심 기능

### Sprint 6-10: 정식 릴리즈 (01/27 ~ 03/31)
- Milestone: 🏙️ Yongin v1.0 Release
- Component: Yongin App + Design System
- 목표: 전체 기능 완성 및 최적화

---

## 🎯 예시 이슈 생성

```bash
# 디자인시스템 이슈
gh issue create \
  --repo pluxity/plug-siteguard \
  --title "[FEATURE] Button 컴포넌트 구현" \
  --label "feature,design-system" \
  --milestone "🎨 Design System v1.0" \
  --assignee whlee-pluxity

# 용인 앱 이슈
gh issue create \
  --repo pluxity/plug-siteguard \
  --title "[FEATURE] 대시보드 레이아웃 구현" \
  --label "feature,yongin-app" \
  --milestone "🏙️ Yongin Prototype" \
  --assignee seung-choi
```

---

## 📌 다음 단계

1. ✅ GitHub에서 Milestone 4개 생성
2. ✅ GitHub Project 생성 및 Repository 연결
3. ✅ Project 필드 7개 추가
4. ✅ Project View 6개 생성
5. ✅ Repository Labels 생성
6. ✅ Issue Templates 추가
7. 🚀 첫 이슈 생성 및 Sprint 1 시작!

---

**프로젝트 URL**: https://github.com/orgs/pluxity/projects/13
