import { Button } from '@plug-siteguard/ui/atoms';

function App() {
  const handleClick = () => {
    alert('용인 스마트시티에 오신 것을 환영합니다!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              용인 스마트시티
            </h1>
            <p className="text-xl text-gray-600">
              미래를 여는 스마트한 도시, 용인
            </p>
          </header>

          {/* Main Content */}
          <main className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                  스마트시티 관제 시스템
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  용인시의 다양한 도시 인프라를 실시간으로 모니터링하고 관리하는
                  통합 관제 시스템입니다. IoT 센서와 AI 기술을 활용하여
                  시민들에게 더 나은 서비스를 제공합니다.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-blue-900">
                      교통 관리
                    </h3>
                    <p className="text-sm text-blue-700">
                      실시간 교통 흐름 분석 및 신호 최적화
                    </p>
                  </div>

                  <div className="p-6 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-green-900">
                      환경 모니터링
                    </h3>
                    <p className="text-sm text-green-700">
                      대기질, 소음 등 환경 데이터 실시간 측정
                    </p>
                  </div>

                  <div className="p-6 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-purple-900">
                      안전 관리
                    </h3>
                    <p className="text-sm text-purple-700">
                      CCTV 통합 관제 및 긴급 상황 대응
                    </p>
                  </div>
                </div>
              </section>

              {/* Buttons */}
              <section className="flex flex-wrap gap-4 justify-center pt-6 border-t border-gray-200">
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleClick}
                >
                  시작하기
                </Button>

                <Button variant="outline" size="lg">
                  더 알아보기
                </Button>

                <Button variant="secondary" size="lg">
                  문의하기
                </Button>

                <Button variant="ghost" size="lg">
                  도움말
                </Button>
              </section>
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-12 text-center text-gray-500 text-sm">
            <p>© 2024 용인시. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
